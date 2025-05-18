"use cache";
import { prisma } from "@/../lib/prisma";
import AnalyzeVariableTeamId from "@/utils/analyzeVariableTeamId";
import { cache } from "react";
import { getEventById, getMatchThatDependsOn } from "../../lib/readQueries";

// リーグ順位計算用のチーム統計データ
interface TeamRankingData {
	teamId: number;
	wins: number;
	losses: number;
	draws: number;
	points: number;
	goalsFor: number;
	goalsAgainst: number;
	goalDifference: number;
}

/**
 * リーグ内の順位を計算して更新する
 */
export async function updateLeagueRankings(
	eventId: number,
	matchId: number,
): Promise<boolean> {
	try {
		// 試合情報を取得
		const matchPlan = await prisma.matchPlan.findUnique({
			where: { id: matchId },
			include: { matchResult: true },
		});

		if (!matchPlan || !matchPlan.matchResult) {
			return false;
		}

		// イベント情報を取得
		const event = await getEventById(eventId);

		if (
			!event ||
			!event.teamData ||
			!Array.isArray(event.teamData) ||
			event.teamData.length === 0
		) {
			return false;
		}

		// JSON型からTypeScriptの型に変換
		const teamDataArray = event.teamData as unknown as TeamData[];

		// その試合結果がリーグ戦のものかどうか確認
		{
			// もしトーナメント形式でこの試合を前提とする試合がある場合
			const matchPlans = await getMatchThatDependsOn(eventId, matchId);

			console.log(`トーナメント形式の試合の数: ${matchPlans.length}`);
			// その試合の他の依存チームの試合も完了しているかチェック
			const dependentMatchPlansWithAllTeams = matchPlans.filter((match) =>
				match.teamIds.every(async (teamId) => {
					const at = AnalyzeVariableTeamId(teamId);
					if (at === null) {
						return true; // 変数IDではない場合は準備okとみなす
					}
					if (at.type === "T") {
						if (at.matchId === matchId) {
							return true; // 今処理中の試合のことだったならそのままok
						} else {
							// それ以外の試合のチームIDの場合は、確認してくる
							const matchPlan = await prisma.matchPlan.findUnique({
								where: { id: Number.parseInt(String(at.matchId)) },
							});
							return matchPlan && matchPlan.status === "Completed";
						}
					} else if (at.type === "L") {
						const blockName = at.blockName;
						const leagueData = teamDataArray[leagueDataIndex] as LeagueTeamData;
						const blockStatus = leagueData.blockStatus || {};
						if (at.eventId === eventId) {
							return (
								blockStatus &&
								blockStatus[blockName] &&
								blockStatus[blockName].completed
							);
						}
					}
					return false; // それ以外の条件はfalse
				}),
			);
			console.log(
				`依存している試合の数: ${dependentMatchPlansWithAllTeams.length}`,
			);
			console.log(
				`依存している試合のID: ${dependentMatchPlansWithAllTeams.map((match) => match.id)}`,
			);
			console.log(
				`依存している試合のチームID: ${dependentMatchPlansWithAllTeams.map((match) => match.teamIds)}`,
			);
			console.log(
				`依存している試合のステータス: ${dependentMatchPlansWithAllTeams.map((match) => match.status)}`,
			);

			// 依存している試合のステータスを更新
			await prisma.matchPlan.updateMany({
				where: {
					id: {
						in: dependentMatchPlansWithAllTeams.map((match) => match.id),
					},
				},
				data: { status: "Preparing" },
			});
		}

		// リーグ形式のデータを見つける
		const leagueDataIndex = teamDataArray.findIndex(
			(data) =>
				data.type === "league" &&
				data.blocks &&
				Object.keys(data.blocks).length > 0,
		);

		console.log("見つける", leagueDataIndex);
		if (leagueDataIndex === -1) {
			return false; // リーグ形式のデータが見つからない
		}

		const leagueData = teamDataArray[leagueDataIndex] as LeagueTeamData;

		// 試合結果に関連するブロックを特定
		const blockName = findBlockByMatch(
			leagueData.blocks,
			matchPlan.matchResult.teamIds.map((id) => id.toString()),
		);

		if (!blockName) {
			return false; // この試合に関連するブロックが見つからない
		}

		// ブロック内の全チームのIDを取得
		const blockTeams: string[] = leagueData.blocks[blockName].map(
			(team: LeagueTeamInfo) => team.teamId,
		);
		// 数値IDを持つチームのみフィルタリング（変数IDは除外）
		const numericTeamIds = blockTeams
			.filter((id) => !id.startsWith("$"))
			.map((id) => Number.parseInt(id));

		// ブロック内の全チームの試合結果を取得して順位を計算
		const { rankings, blockStatus } = await calculateBlockRankings(
			eventId,
			numericTeamIds,
		);

		// 計算された順位でteamDataを更新
		const updatedBlocks = { ...leagueData.blocks };

		// 既存のブロックデータを保持
		const existingBlockData = [...updatedBlocks[blockName]];

		// blockStatusの初期化または更新
		const updatedBlockStatus = leagueData.blockStatus || {};
		updatedBlockStatus[blockName] = blockStatus;

		// 数値IDを持つチームの情報を更新
		updatedBlocks[blockName] = existingBlockData.map((teamInfo) => {
			if (teamInfo.teamId.startsWith("$")) {
				// 変数IDのチームはそのまま保持
				return teamInfo;
			}

			const teamId = Number.parseInt(teamInfo.teamId);
			const ranking = rankings.find((r) => r.teamId === teamId);

			if (ranking) {
				const rankPosition = rankings.findIndex((r) => r.teamId === teamId) + 1;

				// 基本的な統計情報を更新
				const updatedTeamInfo: LeagueTeamInfo = {
					...teamInfo,
					teamId: teamInfo.teamId, // 文字列形式を維持
					wins: ranking.wins,
					losses: ranking.losses,
					draws: ranking.draws,
					points: ranking.points,
					goalsFor: ranking.goalsFor,
					goalsAgainst: ranking.goalsAgainst,
					goalDifference: ranking.goalDifference,
					// 暫定順位は常に更新
					provisionalRank: rankPosition,
				};
				// 全試合完了時のみrankを設定、そうでない場合はrankを削除
				if (blockStatus.completed) {
					updatedTeamInfo.rank = rankPosition;
				} else if (updatedTeamInfo.rank !== undefined) {
					// rankが設定されていたら削除（まだ全試合が終わっていない）
					delete updatedTeamInfo.rank;
				}

				return updatedTeamInfo;
			}

			return teamInfo;
		});

		// イベントのteamDataを更新
		const updatedTeamData = [...teamDataArray];
		updatedTeamData[leagueDataIndex] = {
			...leagueData,
			blocks: updatedBlocks,
			blockStatus: updatedBlockStatus,
		};

		// データベースを更新
		await prisma.event.update({
			where: { id: eventId },
			data: { teamData: JSON.parse(JSON.stringify(updatedTeamData)) },
		});

		if (blockStatus.completed) {
			// もしこのリーグが予選で本選の試合がこのリーグに依存している場合はその試合の依存チーム情報が出揃っている場合に限ってstatusをpreparingにする
			// 予選の試合を取得
			const relatedMatchPlans = await prisma.matchPlan.findMany({
				where: {
					eventId,
					status: "Waiting",
				},
			});
			// 予選の試合の中で、一部このリーグに依存している試合を取得
			const dependentMatchPlans = relatedMatchPlans.filter((match) => {
				return match.teamIds.some((teamId) => {
					const at = AnalyzeVariableTeamId(teamId);
					return at === null || (at.type === "L" && at.blockName === blockName);
				});
			});

			// 依存している試合の中で、全てのチームが出揃っている試合を取得
			const dependentMatchPlansWithAllTeams = dependentMatchPlans.filter(
				(match) => {
					return match.teamIds.every(async (teamId) => {
						const at = AnalyzeVariableTeamId(teamId);
						if (at === null) {
							return true; // 変数IDではない場合は準備okとみなす
						}
						if (at.type === "L") {
							// ブロック内のチームIDの場合
							// そのブロックの結果が出ているか確認する
							if (at.eventId === eventId && at.blockName === blockName) {
								// 今処理中のブロックのことだったならそのままok
								return true;
							} else {
								// それ以外のブロックのチームIDの場合は、確認してくる
								if (at.eventId === eventId) {
									const blockStatus = updatedBlockStatus[at.blockName];
									return blockStatus && blockStatus.completed;
								} else {
									// 他の種目のブロックの場合は、全て完了しているか確認する
									// TODO: 他の種目に依存することは現状ないと考えられるのでpass
									return true;
								}
							}
						} else if (at.type === "T") {
							// チームIDの場合はその試合が完了しているか確認
							const matchPlan = await prisma.matchPlan.findUnique({
								where: { id: Number.parseInt(at.matchId.toString()) },
							});
							return matchPlan && matchPlan.status === "Completed";
						}
					});
				},
			);

			// これらの試合のステータスを更新
			await prisma.matchPlan.updateMany({
				where: {
					id: {
						in: dependentMatchPlansWithAllTeams.map((match) => match.id),
					},
				},
				data: { status: "Preparing" },
			});
		}
		console.log(
			`イベント: ${eventId} ブロック "${blockName}" 状態: 完了=${blockStatus.completed}, 試合=${blockStatus.completedMatches}/${blockStatus.totalMatches}`,
		);

		return true;
	} catch (error) {
		console.error("リーグ順位の更新中にエラーが発生しました:", error);
		return false;
	}
}

/**
 * チームIDがあるブロックを見つける
 */
const findBlockByMatch = cache(
	(
		blocks: Record<string, LeagueTeamInfo[]>,
		teamIds: string[],
	): string | null => {
		for (const [blockName, teams] of Object.entries(blocks)) {
			const blockTeamIds = teams.map((team) => team.teamId);
			// 試合の両チームがこのブロックに属しているかチェック
			const isMatchInBlock = teamIds.every((id) => blockTeamIds.includes(id));

			if (isMatchInBlock) {
				return blockName;
			}
		}

		return null;
	},
);

/**
 * ブロック内の全試合が完了したかチェックする
 */
async function isBlockCompleted(
	eventId: number,
	teamIds: number[],
): Promise<{
	completed: boolean;
	totalMatches: number;
	completedMatches: number;
}> {
	// ブロック内に存在するべき総試合数を計算（チーム数から総当たり戦の試合数を算出）
	const totalTeams = teamIds.length;
	const totalMatches = (totalTeams * (totalTeams - 1)) / 2; // n*(n-1)/2

	// このブロックの試合（完了・未完了を含む）を取得
	const blockMatchPlans = await prisma.matchPlan.findMany({
		where: {
			eventId,
			// このブロックのチームが含まれる試合を検索
			OR: teamIds.map((teamId) => ({
				teamIds: {
					has: teamId.toString(),
				},
			})),
		},
	});

	// ブロック内のチーム同士の試合のみをフィルタリング
	const blockMatches = blockMatchPlans.filter((match) => {
		const matchTeamIds = match.teamIds.map((id) => {
			const numId = Number.parseInt(id);
			return isNaN(numId) ? -1 : numId;
		});

		// この試合の両方のチームがブロックに所属しているか確認
		const teamsInBlock = matchTeamIds.filter((id) => teamIds.includes(id));
		return teamsInBlock.length >= 2; // ブロック内の試合
	});

	// 完了した試合数を計算
	const completedMatches = blockMatches.filter(
		(match) => match.status === "Completed",
	).length;

	return {
		completed: completedMatches === totalMatches,
		totalMatches,
		completedMatches,
	};
}

/**
 * ブロック内のチームの順位を計算
 */
async function calculateBlockRankings(
	eventId: number,
	teamIds: number[],
): Promise<{
	rankings: TeamRankingData[];
	blockStatus: {
		completed: boolean;
		totalMatches: number;
		completedMatches: number;
	};
}> {
	// ブロックの完了状態を確認
	const blockStatus = await isBlockCompleted(eventId, teamIds);

	// このブロック内の全チームの試合結果を取得
	const matchPlans = await prisma.matchPlan.findMany({
		where: {
			eventId,
			status: "Completed",
		},
		include: {
			matchResult: true,
		},
	});

	// チームごとの成績データを初期化
	const teamStats: Record<number, TeamRankingData> = {};
	teamIds.forEach((teamId) => {
		teamStats[teamId] = {
			teamId,
			wins: 0,
			losses: 0,
			draws: 0,
			points: 0,
			goalsFor: 0,
			goalsAgainst: 0,
			goalDifference: 0,
		};
	});

	// 試合結果からチームの成績を集計
	for (const match of matchPlans) {
		if (!match.matchResult) continue;

		const {
			teamIds: matchTeamIds,
			matchScores,
			winnerTeamId,
		} = match.matchResult;

		// この試合が指定されたブロック内のチーム同士の試合かどうかを確認
		const teamsInBlock = matchTeamIds.filter((id) => teamIds.includes(id));
		if (teamsInBlock.length < 2) continue; // ブロック内の試合ではない

		// スコア解析（文字列から数値へ）
		const scores = matchScores.map((score) => {
			const numScore = Number.parseInt(score);
			return isNaN(numScore) ? 0 : numScore;
		});

		// 引き分けかどうかの判定（ここは競技によって異なる可能性あり）
		const isDraw = scores.length >= 2 && scores[0] === scores[1];

		// 各チームの成績を更新
		for (let i = 0; i < matchTeamIds.length; i++) {
			const teamId = matchTeamIds[i];
			if (!teamIds.includes(teamId)) continue; // このブロックのチームではない

			const teamStat = teamStats[teamId];
			if (!teamStat) continue;

			// 得点・失点を更新
			if (scores.length > i) {
				teamStat.goalsFor += scores[i];
				// 失点は相手チームの得点
				const opponentScores = scores.filter((_, index) => index !== i);
				teamStat.goalsAgainst += opponentScores.reduce(
					(sum, score) => sum + score,
					0,
				);
			}

			// 勝敗を更新
			if (isDraw) {
				teamStat.draws += 1;
				teamStat.points += 1; // 引き分けは1ポイント
			} else if (teamId === winnerTeamId) {
				teamStat.wins += 1;
				teamStat.points += 3; // 勝利は3ポイント
			} else {
				teamStat.losses += 1;
				// 敗北はポイントなし
			}

			// 得失点差を更新
			teamStat.goalDifference = teamStat.goalsFor - teamStat.goalsAgainst;
		}
	}

	// 順位付けのためにソート（ポイント、得失点差、得点数の順）
	const rankings = Object.values(teamStats).sort((a, b) => {
		if (a.points !== b.points) return b.points - a.points;
		if (a.goalDifference !== b.goalDifference)
			return b.goalDifference - a.goalDifference;
		return b.goalsFor - a.goalsFor;
	});

	return {
		rankings,
		blockStatus,
	};
}
