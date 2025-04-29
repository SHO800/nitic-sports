import {useCallback, useMemo} from "react";
import {Event, Location, MatchPlan, MatchResult, Score, Team} from "@prisma/client";
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import groupTeams from "@/utils/groupTeams";


export const useData = () => {
    // APIのベースURLを一箇所に定義
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    // SWRフック呼び出しを最適化
    const {
        data: teams,
        error: teamError,
        isLoading: teamLoading,
        mutate: mutateTeams
    } = useSWR<Team[]>(`${API_BASE}/team/-1`, fetcher);

    const {
        data: locations,
        error: locationError,
        isLoading: locationLoading,
        mutate: mutateLocations
    } = useSWR<Location[]>(`${API_BASE}/location/-1`, fetcher);

    const {
        data: events,
        error: eventError,
        isLoading: eventLoading,
        mutate: mutateEvents
    } = useSWR<Event[]>(`${API_BASE}/event/-1`, fetcher);

    const {
        data: matchPlans,
        error: matchPlanError,
        isLoading: matchPlanLoading,
        mutate: mutateMatchPlans
    } = useSWR<MatchPlan[]>(`${API_BASE}/match-plan/-1`, fetcher);

    const {
        data: matchResults,
        error: matchResultError,
        isLoading: matchResultLoading,
        mutate: mutateMatchResults
    } = useSWR<{ [key: string]: MatchResult }>(`${API_BASE}/match-result/-1`, fetcher);

    const {
        data: scores,
        error: scoreError,
        isLoading: scoreLoading,
        mutate: mutateScores
    } = useSWR<Score[]>(`${API_BASE}/score/-1`, fetcher);

    // グループ化されたチームをメモ化
    const groupedTeams = useMemo(() => {
        if (!teams) return {};
        return groupTeams(teams);
    }, [teams]);

    // 必須データが揃っているかのチェック関数
    const hasRequiredData = useCallback(() => {
        return !!(matchPlans && matchResults && teams && events && Array.isArray(teams));
    }, [matchPlans, matchResults, teams, events]);

    // 試合名表示文字列取得関数を最適化
    const getMatchDisplayStr = useCallback((teamId: string | number): string => {
        if (!hasRequiredData()) return '';

        // 変数IDの処理
        if (typeof teamId === "string" && teamId.startsWith("$")) {
            const variableTeamIdData = analyzeVariableTeamId(teamId);
            if (!variableTeamIdData) return '';

            // トーナメント形式の処理
            if (variableTeamIdData.type === "T") {
                const matchPlan = matchPlans!.find((mp) => mp.id === variableTeamIdData.matchId);
                if (!matchPlan) return '';

                const matchName = matchPlan.matchName;
                const expectedResult = variableTeamIdData.condition;
                const matchResult = matchResults![variableTeamIdData.matchId];

                // 試合結果が存在しない場合
                if (!matchResult) return `${matchName}${expectedResult === "W" ? "勝者" : "敗者"}`;

                if (expectedResult === "W") {
                    const team = teams!.find((t) => t.id === matchResult.winnerTeamId);
                    return team ? `${team.name} ` : '';
                }

                if (expectedResult === "L") {
                    const team = teams!.find((t) => t.id === matchResult.loserTeamId);
                    return team ? `${team.name} ` : `${matchName}敗者`;
                }
            }

            // リーグ形式の処理
            if (variableTeamIdData.type === "L") {
                let planStr = `${variableTeamIdData.blockName}ブロック${variableTeamIdData.expectedRank}位`;
                if (variableTeamIdData.eventId === 1) planStr = `${variableTeamIdData.blockName.charCodeAt(0) - 'A'.charCodeAt(0) +1}年の${variableTeamIdData.expectedRank}位`;

                const event = events!.find((e) => e.id === variableTeamIdData.eventId);
                if (!event) return planStr;

                const teamData = event.teamData as unknown as TeamData[];
                if (!teamData) return planStr;

                const teamDataIndex = variableTeamIdData.teamDataIndex;
                if (teamData[teamDataIndex].type !== "league" ) return planStr;

                const block = teamData[teamDataIndex].blocks[variableTeamIdData.blockName];
                if (!block) return planStr;

                const blockTeam = block.find((t) => t.rank === variableTeamIdData.expectedRank);
                if (!blockTeam) return planStr;

                const team = teams!.find((t) => t.id.toString() === blockTeam.teamId);
                return team ? `${team.name} ` : '';
            }

            return '';
        }

        // 通常のチームID処理
        if (!teams || !events || !matchPlans || !matchResults || !Array.isArray(teams)) return '';
        const team = teams.find((t) => t.id === Number(teamId));
        return team ? `${team.name} ` : '';
    }, [teams, events, matchPlans, matchResults, hasRequiredData]);
    
    const getActualTeamIdByVariableId = useCallback((variableId: string): number|null => {
        if (!hasRequiredData() || !variableId.startsWith("$")) return null;

        const variableTeamIdData = analyzeVariableTeamId(variableId);
        if (!variableTeamIdData) return null;

        if (variableTeamIdData.type === "T") {
            const matchPlan = matchPlans!.find((mp) => mp.id === variableTeamIdData.matchId);
            if (!matchPlan) return null;

            const matchResult = matchResults![variableTeamIdData.matchId];
            if (!matchResult) return null;

            return variableTeamIdData.condition === "W" ? matchResult.winnerTeamId : matchResult.loserTeamId;
        }

        if (variableTeamIdData.type === "L") {
            const event = events!.find((e) => e.id === variableTeamIdData.eventId);
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
    }, [matchPlans, matchResults, events, hasRequiredData]);
    
    const getBlockMatches = useCallback((eventId: number, blockName: string, block: { teamId: string }[]): MatchPlan[] => {
        if (!hasRequiredData()) return [];
        if (!blockName) return [];
        
        // 指定された種目において, 指定されたteamIeの配列に含まれるチーム同士の戦いを取得する.
        const blockTeamIds = block.map((team) => team.teamId).sort((a, b) => a.localeCompare(b));
        const matchPlansForEvent = matchPlans!.filter((matchPlan) => matchPlan.eventId === eventId);
        const matchPlansForBlock = matchPlansForEvent.filter((matchPlan) => {
            const teamIds = matchPlan.teamIds as unknown as string[];
            return teamIds.every((teamId) => blockTeamIds.includes(teamId));
        });
        
        return matchPlansForBlock
        
    }, [matchPlans, hasRequiredData]);

    // 試合結果が確定しているかどうかをチェックする関数を最適化
    const isFixedMatchResultByMatchId = useCallback((matchId: string): boolean => {
        if (!hasRequiredData()) return false;

        const matchResult = matchResults![matchId];
        return !!matchResult && matchResult.winnerTeamId !== null;
    }, [matchResults, hasRequiredData]);

    // 変数IDによる試合結果またはブロックランク確定チェック関数を最適化
    const isFixedMatchResultOrBlockRankByVariableId = useCallback((variableId: string): boolean => {
        if (!hasRequiredData() || !variableId.startsWith("$")) return false;

        const variableTeamIdData = analyzeVariableTeamId(variableId);
        if (!variableTeamIdData) return false;

        if (variableTeamIdData.type === "T") {
            const matchId = variableTeamIdData.matchId;
            const matchPlan = matchPlans!.find((mp) => mp.id === matchId);
            if (!matchPlan) return false;

            const matchResult = matchResults![matchId];
            return !!matchResult && matchResult.winnerTeamId !== null;
        }

        if (variableTeamIdData.type === "L") {
            const event = events!.find((e) => e.id === variableTeamIdData.eventId);
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
    }, [matchPlans, matchResults, events, hasRequiredData]);

    // 変数IDからマッチプランを検索する関数を最適化
    const searchMatchPlanByVariableId = useCallback((variableId: string): MatchPlan | null => {
        if (!hasRequiredData()) return null;

        const variableTeamIdData = analyzeVariableTeamId(variableId);
        if (!variableTeamIdData || variableTeamIdData.type !== "T") return null;

        const matchId = variableTeamIdData.matchId;
        return matchPlans!.find((mp) => mp.id === matchId) || null;
    }, [matchPlans, hasRequiredData]);

    // 変数IDからリーグデータを取得する関数を最適化
    const getLeagueDataByVariableId = useCallback((variableId: string): TeamData | null => {
        if (!hasRequiredData()) return null;

        const variableTeamIdData = analyzeVariableTeamId(variableId);
        if (!variableTeamIdData || variableTeamIdData.type !== "L") return null;

        const event = events!.find((e) => e.id === variableTeamIdData.eventId);
        if (!event) return null;

        const jsonData = event.teamData[variableTeamIdData.teamDataIndex];
        return jsonData as unknown as TeamData || null;
    }, [events, hasRequiredData]);

    // 試合IDから試合結果を取得する関数を最適化
    const getMatchResultByMatchId = useCallback((matchId: string | number): MatchResult | null => {
        if (!hasRequiredData() || (typeof matchId === "string" && matchId.startsWith("$"))) return null;

        return matchResults![matchId] || null;
    }, [matchResults, hasRequiredData]);

    // すべてのロード状態を集約
    const isLoading = teamLoading || locationLoading || eventLoading || matchPlanLoading ||
        matchResultLoading || scoreLoading;

    // データロードエラーを集約
    const errors = useMemo(() => {
        return {
            teamError,
            locationError,
            eventError,
            matchPlanError,
            matchResultError,
            scoreError
        };
    }, [teamError, locationError, eventError, matchPlanError, matchResultError, scoreError]);

    return {
        // データ
        teams,
        teamLoading,
        mutateTeams,
        groupedTeams,
        events,
        eventLoading,
        mutateEvents,
        matchPlans,
        matchPlanLoading,
        mutateMatchPlans,
        matchResults,
        matchResultLoading,
        mutateMatchResults,
        locations,
        locationLoading,
        mutateLocations,
        scores,
        scoreLoading,
        mutateScores,
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