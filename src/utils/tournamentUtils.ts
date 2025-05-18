import type { TeamIdVariableDataType } from "@/types/variableTeamId";
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";
import type { Event, MatchPlan, MatchResult, Team } from "@prisma/client";
import { cache } from "react";

export type TournamentMatchNode = {
	matchId: number;
	teamIds: string[]; // チームID
	matchPlan: MatchPlan;
	debug?: string; // デバッグ用
	position: number; // 同じラウンド内での位置
	premiseNode?: (TournamentNode | string[] | null)[]; // 前提とする試合のノードまたは前提とする試合を含むId
};
export type TournamentNodeTeam = {
	nodeId: number;
	type: "team";
	teamId: string | number;
	row: number;
	column: number;
	nextNode?: TournamentNode | null;
};

export type TournamentNodeMatch = {
	nodeId: number;
	type: "match";
	matchId: number;
	row: number;
	column: number;
	tournamentMatchNode: TournamentMatchNode;
	nextNode?: TournamentNode | null;
};

export type TournamentNode = TournamentNodeTeam | TournamentNodeMatch;

export const implementsTournamentNode = (obj: any): obj is TournamentNode => {
	return (
		obj &&
		typeof obj.nodeId === "number" &&
		(obj.type === "team" || obj.type === "match") &&
		typeof obj.row === "number" &&
		typeof obj.column === "number"
	);
};

export const implementsTournamentMatchNode = (
	obj: any,
): obj is TournamentMatchNode => {
	return (
		obj &&
		typeof obj.matchId === "number" &&
		obj.teamIds &&
		Array.isArray(obj.teamIds) &&
		typeof obj.round === "number" &&
		typeof obj.row === "number" &&
		typeof obj.position === "number" &&
		(obj.premiseNode === undefined || Array.isArray(obj.premiseNode))
	);
};

export interface TournamentData {
	rounds: number;
	nodes: TournamentNode[];
	teamIds: string[];
	teamMap: Record<number, { name: string; color?: string }>;
	matchPlanRange: MatchPlanRange;
}

/**
 * イベントデータからトーナメントの構造を構築する
 */
export const buildTournamentBracket = cache(
	(
		event: Event,
		relatedMatchPlans: MatchPlan[],
		allMatchPlans: MatchPlan[],
		teams: Team[],
		isFinal: boolean,
	): TournamentData | null => {
		if (!event || !relatedMatchPlans || !teams) {
			return null;
		}

		// チームデータのインデックス(予選:0, 本選:1)
		const teamDataIndex = isFinal ? 1 : 0;

		// イベントからトーナメントデータを取得
		const tournamentData =
			Array.isArray(event.teamData) && event.teamData.length > teamDataIndex
				? (event.teamData[teamDataIndex] as unknown as TeamData)
				: null;

		if (!tournamentData || tournamentData.type !== "tournament") {
			return null;
		}

		// チームマップの作成
		const teamMap: Record<number, { name: string; color?: string }> = {};
		teams.forEach((team) => {
			teamMap[team.id] = { name: team.name, color: team.color || undefined };
		});

		const tournamentMatches = relatedMatchPlans.toSorted((a, b) => a.id - b.id);

		// トーナメントの深さ（ラウンド数）を計算
		const teamIds = tournamentData.teams
			? tournamentData.teams.map((t) => t.teamId)
			: [];
		const rounds = Math.ceil(Math.log2(teamIds.length || 1));

		const teamNodes = teamIds.map(
			(teamId, index) =>
				({
					type: "team",
					nodeId: index,
					teamId,
					row: index * 2 + 1,
					column: 0,
				}) as TournamentNode,
		);

		// トーナメントノードを構築
		const tournamentNodes = constructTournament(
			teamNodes,
			tournamentMatches, // このトーナメントに関係している試合情報
			allMatchPlans,
			tournamentData.teams || [],
		);

		const nodes = [
			...teamNodes,
			...tournamentNodes
				.filter((node) => node.type === "match")
				.sort(
					(a, b) =>
						a.column - b.column ||
						a.tournamentMatchNode.position - b.tournamentMatchNode.position,
				),
		];
		// 各ノードに行数を追加

		// チームの並びは最初に参加チームとして登場するときに並びを決める
		// そこから依存ノードのチームidから検索する

		// 準々決勝とかのrowの計算がうまく行っておらず全部2とかになる このnodeでのrowの更新がuseStateみたいに途中で行われないのかもしれない
		// 決勝戦かどうかはisFinalフィールドを優先して使用する
		// 个 各nodeに複製されたpremiseNodeを更新していたせいでtournamentNodesにある本体が更新されていなかったせい
		// nodesの先頭から見ていき, それまで追加された要素があることを前提として処理しているが, 参加チームの設定と各試合の順番に不整合がなければこれで正常に動作する.

		for (let index = 0; index < nodes.length; index++) {
			const node = nodes[index];
			if (node.type === "team") continue;

			const relatedTeams = getAllRelatedTeamNodes(nodes, node);
			if (relatedTeams.length === 0) {
				node.row = index * 2 + 1;
			} else {
				node.row =
					relatedTeams
						.flatMap((premise) => premise.row)
						.reduce((a, b) => a + b) / relatedTeams.length;
			}
		}

		return {
			rounds,
			nodes,
			teamIds,
			teamMap,
			matchPlanRange: tournamentData.matchPlanIdRange!,
		};
	},
);

/**
 * 与えられたnodesの中からsearchNodesとして与えられたノードあるいはチームを検索し, そのnodeを返す.
 */
const searchTeamOrMatchNodes = cache(
	(
		nodes: TournamentNode[],
		searchNode: TournamentNode | string[],
	): TournamentNode[] => {
		const foundNodes: TournamentNode[] = [];

		function searchAndPushTeamNode(teamId: string) {
			const teamNode = nodes.find(
				(node) => node.type === "team" && node.teamId === teamId,
			);
			if (teamNode) {
				foundNodes.push(teamNode);
			}
		}

		if ("length" in searchNode) {
			// string[]
			searchNode.forEach((teamId) => {
				// 各チームIdについて, それが素のnumberなら直接teamNode, 変数idでこのトーナメント内の試合ならnode, このトーナメント外の試合ならteamNode
				if (teamId.startsWith("$")) {
					const analyzed = analyzeVariableTeamId(teamId);
					if (!analyzed) return;
					if (analyzed.type === "T") {
						// あるトーナメント制の試合結果に依存する場合
						const referencedMatchId = analyzed.matchId; // その依存先の試合idを取得しておき
						const referencedMatch = nodes.find(
							(node) =>
								node.type === "match" && node.matchId === referencedMatchId,
						); // これでだめならtournamentRangeを参照のこと.
						if (referencedMatch) {
							// もしnodesに含まれる ( ⇒ そのトーナメント内に存在するnodeなら
							if (analyzed.condition === "L") {
								searchAndPushTeamNode(teamId);
							} else {
								foundNodes.push(referencedMatch);
							}
						} else {
							// もしそのトーナメント内に存在しないnodeなら
							// その変数teamIdとして登録されているteamノードがないかを探す
							searchAndPushTeamNode(teamId);
						}
					} else {
						// あるリーグ制の試合結果に依存する場合
						// このトーナメント内の試合には依存していないことが明らかなので、その変数idを持つteamを探す
						searchAndPushTeamNode(teamId);
					}
				} else {
					// 素のnumber
					searchAndPushTeamNode(teamId);
				}
			});
		} else {
			// TournamentNode
			if (searchNode.type === "match") {
				const matchNode = nodes.find(
					(node) =>
						node.type === "match" && node.matchId === searchNode.matchId,
				);
				if (matchNode) {
					foundNodes.push(matchNode);
				}
			} else {
				// searchNodeがteam
				const teamNode = nodes.find(
					(node) => node.type === "team" && node.teamId === searchNode.teamId,
				);
				if (teamNode) {
					foundNodes.push(teamNode);
				}
			}
		}

		return foundNodes;
	},
);
/**
 * matchNodeが与えられたら, その前提試合も再帰的に全て取得したうえで, 関係のあるチームノード全てを取得する.
 */
const getAllRelatedTeamNodes = cache(
	(nodes: TournamentNode[], matchNode: TournamentNode): TournamentNode[] => {
		const relatedTeamNodes: TournamentNode[] = [];

		if (matchNode.type !== "match") return [matchNode]; // teamNodeが与えられたとしても, それは既に最下段にいる

		const relatedNodes = searchTeamOrMatchNodes(
			nodes,
			matchNode.tournamentMatchNode.teamIds,
		);
		if (!relatedNodes) return [];
		relatedNodes.forEach((relatedNode) => {
			if (relatedNode.type === "team") {
				relatedTeamNodes.push(relatedNode);
			} else if (relatedNode.tournamentMatchNode.matchPlan.is3rdPlaceMatch) {
				relatedTeamNodes.push(relatedNode);
			} else {
				relatedTeamNodes.push(...getAllRelatedTeamNodes(nodes, relatedNode));
			}
		});

		return relatedTeamNodes;
	},
);

/**
 * 試合データからトーナメント構造を構築する。
 * 結果は考慮せず, 形状のみ。
 */
const constructTournament = cache(
	(
		teamNodes: TournamentNode[],
		relatedMatchPlans: MatchPlan[],
		allMatchPlans: MatchPlan[],
		TeamInfos: TeamInfo[],
		canContain3rdMatch = true,
	): TournamentNode[] => {
		const nodes: TournamentNode[] = [...teamNodes];

		// 試合IDをキーにした試合データのマッピングを作成。渡されたmatchPlansと中身は同じ。
		const matchPlanMap = new Map();
		relatedMatchPlans.forEach((matchPlan) => {
			matchPlanMap.set(matchPlan.id, matchPlan);
		});

		const allMatchPlanMap = new Map();
		allMatchPlans.forEach((matchPlan) => {
			allMatchPlanMap.set(matchPlan.id, matchPlan);
		});

		// 渡された, このトーナメントに関連する全ての試合について繰り返す
		relatedMatchPlans.forEach((matchPlan) => {
			// 試合ノードを作成
			const matchNode: TournamentNode = {
				type: "match",
				nodeId: nodes.length,
				matchId: matchPlan.id,
				row: 0, // 初期値
				column:
					calculateRound(matchPlan, relatedMatchPlans, true, TeamInfos) + 1,
				tournamentMatchNode: {
					matchId: matchPlan.id,
					teamIds: matchPlan.teamIds,
					matchPlan,
					position: calculatePosition(matchPlan, relatedMatchPlans),
					premiseNode: [null, null],
				},
			};

			// チームIDを解析して、何かの試合を前提としているならそのidを指定
			matchPlan.teamIds.forEach((teamId: string, index: number) => {
				if (teamId.startsWith("$")) {
					// 何かの試合を前提としているなら
					const analyzed = analyzeVariableTeamId(teamId); // 分析して
					if (!analyzed) return;
					if (analyzed.type === "T") {
						// あるトーナメント制の試合結果に依存する場合
						const referencedMatchId = analyzed.matchId; // その依存先の試合idを取得しておき
						if (matchPlanMap.has(referencedMatchId)) {
							// その依存先の試合がこのトーナメント内の試合であるならば
							const referencedMatch = matchPlanMap.get(referencedMatchId); // その依存先の試合のデータを取得
							matchNode.tournamentMatchNode.premiseNode![index] = {
								// この試合の依存関係にその参照先の試合情報を追加
								nodeId: nodes.length, // しかしもしすでにある場合はそれ+1にしたい
								type: "match",
								row: 0, // 初期値
								column:
									calculateRound(
										referencedMatch,
										relatedMatchPlans,
										true,
										TeamInfos,
									) + 1,
								nextNode: matchNode,
								tournamentMatchNode: {
									matchId: referencedMatch.id,
									teamIds: referencedMatch.teamIds,
									matchPlan: referencedMatch,
									position: calculatePosition(
										referencedMatch,
										relatedMatchPlans,
									),
									premiseNode: [null, null],
								},
							} as TournamentNode;

							// 依存先の試合のノードを追加
							if (analyzed.condition === "W") {
								const referencedMatchNode = nodes.find(
									(node) =>
										node.type === "match" &&
										node.matchId === referencedMatch.id,
								);
								if (
									referencedMatchNode &&
									referencedMatchNode.type === "match"
								) {
									referencedMatchNode.nextNode = matchNode; // 依存先の試合のノードにこの試合を追加
								}
							}
							if (canContain3rdMatch && analyzed.condition === "L") {
								const referencedTeamNode = nodes.find(
									(node) => node.type === "team" && node.teamId === teamId,
								);
								if (referencedTeamNode && referencedTeamNode.type === "team") {
									referencedTeamNode.nextNode = matchNode; // 依存先の試合のノードにこの試合を追加
								}
							}
						} else {
							// その依存先の試合がこのトーナメント内の試合でないならば
							// 依存関係にその試合の情報を含むチーム名を追加
							matchNode.tournamentMatchNode.premiseNode![index] = [teamId];
							// そのチーム名のノードの次のノードに自分を指定
							const teamNode = nodes.find(
								(node) => node.type === "team" && node.teamId === teamId,
							);
							if (teamNode) {
								teamNode.nextNode = matchNode;
							}
						}
					} else {
						// あるリーグ制の試合結果に依存する場合
						// このトーナメント内の試合には依存していないことが明らかなので、依存関係にその試合情報を含むチーム名を追加.
						matchNode.tournamentMatchNode.premiseNode![index] = [teamId];
						// そのチーム名のノードの次のノードに自分を指定
						const teamNode = nodes.find(
							(node) => node.type === "team" && node.teamId === teamId,
						);
						if (teamNode) {
							teamNode.nextNode = matchNode;
						}
					}
				} else {
					// なにかの試合を前提としていない (直接チームidが指定されている) 場合は依存関係がない そのチームノードの次のノードに自分を指定
					// そのチーム名のノードの次のノードに自分を指定
					const teamNode = nodes.find(
						(node) => node.type === "team" && node.teamId === teamId,
					);
					if (teamNode) {
						teamNode.nextNode = matchNode;
					}
				}
			});
			nodes.push(matchNode); // 試合ノードを追加
		});

		return nodes;
	},
);

/**
 * 試合のラウンドを計算
 */
const calculateRound = cache(
	(
		match: MatchPlan,
		allMatches: MatchPlan[],
		detect3rdMatch = false,
		teamInfos: TeamInfo[] = [],
	): number => {
		// 参照関係からラウンド数を推定

		const dependencies = match.teamIds
			.map((teamId) => analyzeVariableTeamId(teamId))
			.filter((node) => node !== null);
		const minSeedCount = Math.min(
			...match.teamIds.map((teamId) => getSeedCount(teamId, teamInfos)),
		);
		if (!dependencies) return 1 + minSeedCount;

		if (
			dependencies.length === 0 ||
			(detect3rdMatch &&
				dependencies.every((a) => a.type === "T" && a.condition === "L"))
		) {
			return 1 + minSeedCount; // 初戦
		} else {
			// 参照している試合から最大ラウンドを計算
			let maxRound = 0;
			dependencies.forEach((dep: TeamIdVariableDataType) => {
				if (dep.type == "T") {
					const referencedMatch = allMatches.find((m) => m.id === dep.matchId);
					if (referencedMatch) {
						const round = calculateRound(
							referencedMatch,
							allMatches,
							detect3rdMatch,
							teamInfos,
						);
						maxRound = Math.max(maxRound, round);
					}
				}
			});
			return maxRound + 1 + minSeedCount;
		}
	},
);

/**
 * 試合の位置（同じラウンド内での順序）を計算
 */
const calculatePosition = cache(
	(match: MatchPlan, allMatches: MatchPlan[]): number => {
		const sameRoundMatches = allMatches.filter(
			(m) =>
				calculateRound(m, allMatches) === calculateRound(match, allMatches),
			true,
		);
		return sameRoundMatches.indexOf(match);
	},
);

export const getSeedCount = cache((teamId: string, teamInfo: TeamInfo[]) => {
	if (teamInfo.length === 0) return 0;
	const foundSeed = teamInfo.find((t) => t.teamId === teamId)?.seedCount;
	if (
		foundSeed === undefined ||
		foundSeed === Number.POSITIVE_INFINITY ||
		isNaN(foundSeed)
	)
		return 0;
	return foundSeed;
});

export const findVariableIdFromNumberId = cache(
	(
		numberId: number,
		relatedMatchPlans: MatchPlan[],
		relatedMatchResults: MatchResult[],
	): string | null => {
		const matchResult = relatedMatchResults.find((matchResult) =>
			matchResult.teamIds.includes(numberId),
		);
		if (!matchResult) return null;
		const index = matchResult.teamIds.indexOf(numberId);

		const matchPlan = relatedMatchPlans.find(
			(matchPlan) => matchPlan.id === matchResult.matchId,
		);
		if (!matchPlan) return null;
		return matchPlan.teamIds[index];
	},
);
