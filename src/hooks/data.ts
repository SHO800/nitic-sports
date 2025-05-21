import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";
import fetcher from "@/utils/fetcher";
import groupTeams from "@/utils/groupTeams";
import type {
	Event,
	Location,
	MatchPlan,
	MatchResult,
	Score,
	Team,
} from "@prisma/client";
import { useCallback, useMemo } from "react";
import useSWR, {SWRConfiguration} from "swr";

// メモ化キャッシュの導入
const MEMO_CACHE = new Map<string, { value: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30秒間キャッシュを保持

// メモ化関数
function memoize<T>(key: string, compute: () => T): T {
	const now = Date.now();
	const cached = MEMO_CACHE.get(key);

	// 有効なキャッシュがあれば使用
	if (cached && now - cached.timestamp < CACHE_TTL) {
		return cached.value;
	}

	// キャッシュがなければ計算して保存
	const value = compute();
	MEMO_CACHE.set(key, { value, timestamp: now });
	return value;
}

export const useData = (options?: { refreshInterval?: number }) => {
	// APIのベースURLを一箇所に定義
	const API_BASE = process.env.NEXT_PUBLIC_API_URL;

	// SWRの設定を最適化
	const swrConfigBase: SWRConfiguration = {
		revalidateIfStale: true, // 古いデータがある場合は再検証する
		revalidateOnReconnect: true, // 再接続時に再検証する
		dedupingInterval: 5000, // 5秒間の重複リクエスト防止
		errorRetryCount: 3, // エラー再試行回数の制限
	};
	
	// 短期的なもの
	const swrConfigShort: SWRConfiguration = {
		...swrConfigBase,
		refreshInterval: 15000, // 15秒ごとに再検証
		revalidateOnFocus: true, // フォーカス時に再検証する
	};
	
	// 長期的なもの
	const swrConfigLong: SWRConfiguration = {
		...swrConfigBase,
		revalidateOnFocus: false, // フォーカス時に再検証しない
	};
	

	// SWRフック呼び出しを最適化

	// teams, locationsは従来通り個別取得
	const {
		data: teams,
		error: teamError,
		isLoading: teamLoading,
		mutate: mutateTeams,
	} = useSWR<Team[]>(
		`${API_BASE}/team`,
		(url) => fetcher(url, { next: { tags: ["teams"] } }),
		swrConfigLong,
	);

	const {
		data: locations,
		error: locationError,
		isLoading: locationLoading,
		mutate: mutateLocations,
	} = useSWR<Location[]>(
		`${API_BASE}/location`,
		(url) => fetcher(url, { next: { tags: ["locations"] } }),
		swrConfigLong,
	);

	// match-dataエンドポイントで一括取得
	const {
		data: matchData,
		error: matchDataError,
		isLoading: matchDataLoading,
		mutate: mutateMatchData,
	} = useSWR<{
		matchPlans: MatchPlan[];
		matchResults: { [key: string]: MatchResult };
		scores: Score[];
		events: Event[];
	}>(
		`${API_BASE}/match-data`,
		(url) => fetcher(url, { next: { tags: ["matchPlans", "matchResults", "scores", "events"] } }),
		{
			...swrConfigBase,
			refreshInterval: options?.refreshInterval ?? 180000, // デフォルト3分、上書き可
			revalidateOnFocus: false,
		},
	);

	// 取得データを分割
	const matchPlans = matchData?.matchPlans;
	const matchResults = matchData?.matchResults;
	const scores = matchData?.scores;
	const events = matchData?.events;

	// グループ化されたチームをメモ化
	const groupedTeams = useMemo(() => {
		if (!teams) return {};
		return groupTeams(teams);
	}, [teams]);

	// 必須データが揃っているかのチェック関数
	const hasRequiredData = useCallback(() => {
		return !!(
			matchPlans &&
			matchResults &&
			teams &&
			events &&
			Array.isArray(teams)
		);
	}, [matchPlans, matchResults, teams, events]);

	// 試合名表示文字列取得関数をメモ化
	const getMatchDisplayStr = useCallback(
		(teamId: string | number): string => {
			if (!hasRequiredData()) return "";

			// メモ化キャッシュを活用
			return memoize(`displayStr-${teamId}`, () => {
				// 変数IDの処理
				if (typeof teamId === "string" && teamId.startsWith("$")) {
					const variableTeamIdData = analyzeVariableTeamId(teamId);
					if (!variableTeamIdData) return "";

					// トーナメント形式の処理
					if (variableTeamIdData.type === "T") {
						const matchPlan = matchPlans?.find(
							(mp) => mp.id === variableTeamIdData.matchId,
						);
						if (!matchPlan) return "";

						const matchName = matchPlan.matchName;
						const expectedResult = variableTeamIdData.condition;
						const matchResult = matchResults?.[variableTeamIdData.matchId];

						// 試合結果が存在しない場合
						if (!matchResult)
							return `${matchName}${expectedResult === "W" ? "勝者" : "敗者"}`;

						if (expectedResult === "W") {
							const team = teams?.find(
								(t) => t.id === matchResult.winnerTeamId,
							);
							return team ? `${team.name} ` : "";
						}

						if (expectedResult === "L") {
							const team = teams?.find((t) => t.id === matchResult.loserTeamId);
							return team ? `${team.name} ` : `${matchName}敗者`;
						}
					}

					// リーグ形式の処理
					if (variableTeamIdData.type === "L") {
						let planStr = `${variableTeamIdData.blockName}ブロック${variableTeamIdData.expectedRank}位`;
						if (variableTeamIdData.eventId === 1)
							planStr = `${variableTeamIdData.blockName.charCodeAt(0) - "A".charCodeAt(0) + 1}年の${variableTeamIdData.expectedRank}位`;

						const event = events?.find(
							(e) => e.id === variableTeamIdData.eventId,
						);
						if (!event) return planStr;

						const teamData = event.teamData as unknown as TeamData[];
						if (!teamData) return planStr;

						const teamDataIndex = variableTeamIdData.teamDataIndex;
						if (
							!teamData[teamDataIndex] ||
							teamData[teamDataIndex].type !== "league"
						)
							return planStr;

						const block =
							teamData[teamDataIndex].blocks[variableTeamIdData.blockName];
						if (!block) return planStr;

						const blockTeam = block.find(
							(t) => t.rank === variableTeamIdData.expectedRank,
						);
						if (!blockTeam) return planStr;

						const team = teams?.find(
							(t) => t.id.toString() === blockTeam.teamId,
						);
						return team ? `${team.name} ` : "";
					}

					return "";
				}

				// 通常のチームID処理
				if (
					!teams ||
					!events ||
					!matchPlans ||
					!matchResults ||
					!Array.isArray(teams)
				)
					return "";
				const team = teams.find((t) => t.id === Number(teamId));
				return team ? `${team.name} ` : "";
			});
		},
		[teams, events, matchPlans, matchResults, hasRequiredData],
	);

	// 以下の関数もメモ化によって最適化
	const getActualTeamIdByVariableId = useCallback(
		(variableId: string): number | null => {
			if (!hasRequiredData()) return null;

			return memoize(`actualTeamId-${variableId}`, () => {
				if (!variableId.startsWith("$")) return Number.parseInt(variableId);

				const variableTeamIdData = analyzeVariableTeamId(variableId);
				if (!variableTeamIdData) return null;

				if (variableTeamIdData.type === "T") {
					const matchPlan = matchPlans?.find(
						(mp) => mp.id === variableTeamIdData.matchId,
					);
					if (!matchPlan) return null;

					const matchResult = matchResults?.[variableTeamIdData.matchId];
					if (!matchResult) return null;

					return variableTeamIdData.condition === "W"
						? matchResult.winnerTeamId
						: matchResult.loserTeamId;
				}

				if (variableTeamIdData.type === "L") {
					const event = events?.find(
						(e) => e.id === variableTeamIdData.eventId,
					);
					if (!event) return null;

					const teamData = event.teamData as unknown as TeamData[];
					if (!teamData) return null;

					const teamDataIndex = variableTeamIdData.teamDataIndex;
					const blockName = variableTeamIdData.blockName;
					const expectedRank = variableTeamIdData.expectedRank;

					if (teamData[teamDataIndex].type !== "league") return null;

					const block = teamData[teamDataIndex].blocks[blockName];
					if (!block) return null;

					const blockTeam = block.find((t) => t.rank === expectedRank);
					if (!blockTeam) return null;

					return Number(blockTeam.teamId);
				}

				return null;
			});
		},
		[matchPlans, matchResults, events, hasRequiredData],
	);

	// ブロック内の試合情報を取得する関数の最適化
	const getBlockMatches = useCallback(
		(
			eventId: number,
			blockName: string,
			block: { teamId: string }[],
		): MatchPlan[] => {
			if (!hasRequiredData()) return [];
			if (!blockName) return [];

			// チームID配列をソートして一意のキーを生成
			const blockTeamIds = block
				.map((team) => team.teamId)
				.sort()
				.join(",");
			const cacheKey = `blockMatches-${eventId}-${blockName}-${blockTeamIds}`;

			return memoize(cacheKey, () => {
				// 指定された種目において, 指定されたteamIdsの配列に含まれるチーム同士の戦いを取得する
				const sortedTeamIds = block.map((team) => team.teamId).sort();
				const matchPlansForEvent = matchPlans?.filter(
					(matchPlan) => matchPlan.eventId === eventId,
				);
				if (!matchPlansForEvent) return [];
				const matchPlansForBlock = matchPlansForEvent.filter((matchPlan) => {
					const teamIds = matchPlan.teamIds as unknown as string[];
					return teamIds.every((teamId) => sortedTeamIds.includes(teamId));
				});

				return matchPlansForBlock;
			});
		},
		[matchPlans, hasRequiredData],
	);

	// 試合結果が確定しているかどうかをチェックする関数を最適化
	const isFixedMatchResultByMatchId = useCallback(
		(matchId: string): boolean => {
			if (!hasRequiredData()) return false;

			return memoize(`isFixedMatch-${matchId}`, () => {
				const matchResult = matchResults?.[matchId];
				return !!matchResult && matchResult.winnerTeamId !== null;
			});
		},
		[matchResults, hasRequiredData],
	);

	// 変数IDによる試合結果またはブロックランク確定チェック関数を最適化
	const isFixedMatchResultOrBlockRankByVariableId = useCallback(
		(variableId: string): boolean => {
			if (!hasRequiredData() || !variableId.startsWith("$")) return false;

			return memoize(`isFixedMatchOrRank-${variableId}`, () => {
				const variableTeamIdData = analyzeVariableTeamId(variableId);
				if (!variableTeamIdData) return false;

				if (variableTeamIdData.type === "T") {
					const matchId = variableTeamIdData.matchId;
					const matchPlan = matchPlans?.find((mp) => mp.id === matchId);
					if (!matchPlan) return false;

					const matchResult = matchResults?.[matchId];
					return !!matchResult && matchResult.winnerTeamId !== null;
				}

				if (variableTeamIdData.type === "L") {
					const event = events?.find(
						(e) => e.id === variableTeamIdData.eventId,
					);
					if (!event) return false;

					const teamData = event.teamData as unknown as TeamData[];
					if (!teamData) return false;

					const teamDataIndex = variableTeamIdData.teamDataIndex;
					const blockName = variableTeamIdData.blockName;
					const expectedRank = variableTeamIdData.expectedRank;

					if (teamData[teamDataIndex].type !== "league") return false;

					const block = teamData[teamDataIndex].blocks[blockName];
					if (!block) return false;

					return !!block.find((t) => t.rank === expectedRank);
				}

				return false;
			});
		},
		[matchPlans, matchResults, events, hasRequiredData],
	);

	// 変数IDからマッチプランを検索する関数を最適化
	const searchMatchPlanByVariableId = useCallback(
		(variableId: string): MatchPlan | null => {
			if (!hasRequiredData()) return null;

			return memoize(`matchPlanByVarId-${variableId}`, () => {
				const variableTeamIdData = analyzeVariableTeamId(variableId);
				if (!variableTeamIdData || variableTeamIdData.type !== "T") return null;

				const matchId = variableTeamIdData.matchId;
				return matchPlans?.find((mp) => mp.id === matchId) || null;
			});
		},
		[matchPlans, hasRequiredData],
	);

	// 変数IDからリーグデータを取得する関数を最適化
	const getLeagueDataByVariableId = useCallback(
		(variableId: string): TeamData | null => {
			if (!hasRequiredData()) return null;

			return memoize(`leagueDataByVarId-${variableId}`, () => {
				const variableTeamIdData = analyzeVariableTeamId(variableId);
				if (!variableTeamIdData || variableTeamIdData.type !== "L") return null;

				const event = events?.find((e) => e.id === variableTeamIdData.eventId);
				if (!event) return null;

				const jsonData = event.teamData[variableTeamIdData.teamDataIndex];
				return (jsonData as unknown as TeamData) || null;
			});
		},
		[events, hasRequiredData],
	);

	// 試合IDから試合結果を取得する関数を最適化
	const getMatchResultByMatchId = useCallback(
		(matchId: string | number): MatchResult | null => {
			if (
				!hasRequiredData() ||
				(typeof matchId === "string" && matchId.startsWith("$"))
			)
				return null;

			return memoize(`matchResultById-${matchId}`, () => {
				return matchResults?.[matchId] || null;
			});
		},
		[matchResults, hasRequiredData],
	);

	// すべてのロード状態を集約
	const isLoading =
		teamLoading ||
		locationLoading ||
		matchDataLoading;

	// データロードエラーを集約
	const errors = useMemo(() => {
		return {
			teamError,
			locationError,
			matchDataError,
		};
	}, [
		teamError,
		locationError,
		matchDataError,
	]);

	return {
		// データ
		teams,
		teamLoading,
		mutateTeams,
		groupedTeams,
		events,
		matchPlans,
		matchResults,
		locations,
		mutateMatchData,
		locationLoading,
		mutateLocations,
		scores,
		// 集約した状態
		isLoading,
		hasErrors: Object.values(errors).some(Boolean),
		errors,

		// 最適化したヘルパー関数
		getBlockMatches,
		getMatchDisplayStr,
		getActualTeamIdByVariableId,
		isFixedMatchResult: isFixedMatchResultByMatchId,
		isFixedMatchResultOrBlockRankByVariableId,
		searchMatchPlanByVariableId,
		getMatchResultByMatchId,
		getLeagueDataByVariableId,
	};
};
