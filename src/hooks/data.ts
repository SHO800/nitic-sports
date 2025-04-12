import {useEffect, useState} from "react";
import {Event, Location, MatchPlan, MatchResult, Score, Team} from "@prisma/client";
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import groupTeams from "@/utils/groupTeams";

export const useData = () => {
    // const [teams, setTeamsx] = useState<Team[]>([])
    const {
        data: teams,
        error: teamError,
        isLoading: teamLoading,
        mutate: mutateTeams
    } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/team/-1`, fetcher<Team[]>)
    const {
        data: locations,
        error: locationError,
        isLoading: locationLoading,
        mutate: mutateLocations
    } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/location/-1`, fetcher<Location[]>)
    const {
        data: events,
        error: eventError,
        isLoading: eventLoading,
        mutate: mutateEvents
    } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/event/-1`, fetcher<Event[]>)
    const {
        data: matchPlans,
        error: matchPlanError,
        isLoading: matchPlanLoading,
        mutate: mutateMatchPlans
    } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/match-plan/-1`, fetcher<MatchPlan[]>)
    const {
        data: matchResults,
        error: matchResultError,
        isLoading: matchResultLoading,
        mutate: mutateMatchResults
    } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/match-result/-1`, fetcher<{ [key: string]: MatchResult }>)
    const {
        data: scores,
        error: scoreError,
        isLoading: scoreLoading,
        mutate: mutateScores
    } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/score/-1`, fetcher<Score[]>)
    // const {data: schedules, error: scheduleError, isLoading: scheduleLoading} = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/schedule/-1`, fetcher<ScheduleImage[]>)
    // const {data: eventSchedules, error: eventScheduleError, isLoading: eventScheduleLoading} = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/event-schedule/-1`, fetcher<EventSchedule[]>)

    const [groupedTeams, setGroupedTeams] = useState<Record<string, Team[]>>({})

    useEffect(() => {
        if (teams) {
            const grouped = groupTeams(teams)
            setGroupedTeams(grouped)
        }
    }, [teams]);

    const getMatchDisplayStr = (teamId: string | number): string => {
        if (!matchPlans || !matchResults || !teams || !events) return ''

        // これが試合名取得処理
        if (typeof teamId === "string" && teamId.startsWith("$")) { // 特殊IDなら
            // $<T(ournament)-[matchId]-[W|L] | L(eague)-[eventId]-[teamDataでのindex(0なら予選, 1なら本選)]-[blockName]-[rank]> のように指定する。Wは勝利チーム、Lは敗北チームを意味する。 例: $T-1-W, $T-20-L, $L-1-0-A-1, $L-3-0-B-2
            const variableTeamIdData = analyzeVariableTeamId(teamId);
            if (variableTeamIdData === null) return '';

            if (variableTeamIdData?.type === "T") { // 対象試合がトーナメント

                const matchPlan = matchPlans.find((matchPlan) => matchPlan.id === variableTeamIdData.matchId)
                const matchResult = matchResults[variableTeamIdData.matchId]
                if (!matchPlan) return ''
                const matchName = matchPlan?.matchName
                const expectedResult = variableTeamIdData.condition;
                // まだ試合結果が存在しない場合
                if (!matchResult) return `< ${matchName}${expectedResult === "W" ? "勝者" : "敗者"} >`


                if (expectedResult === "W") {
                    return teams.find((team) => team.id === matchResult.winnerTeamId)?.name + " "
                }
                if (expectedResult === "L") {
                    return teams.find((team) => team.id === matchResult.loserTeamId)?.name + " "
                }
            }
            if (variableTeamIdData?.type === "L") { // 対象試合がリーグ

                const event = events.find((event) => event.id === variableTeamIdData.eventId)
                if (!event) return ''
                const teamData = event.teamData as unknown as TeamData[]
                if (!teamData) return ''

                const block = teamData[variableTeamIdData.teamDataIndex].blocks![variableTeamIdData.blockName]
                if (!block) return ''

                const blockTeam = block.find((team) => team.rank === variableTeamIdData.expectedRank)
                // まだブロックの最終結果が存在しない場合
                if (!blockTeam) return `< ${variableTeamIdData.blockName}ブロック${variableTeamIdData.expectedRank}位 >`

                // その順位のチームがいた場合
                const teamId = blockTeam.teamId
                const team = teams.find((team) => team.id === teamId)
                if (!team) return ''
                return `${team.name} `
            }
            return ''

        }
        // 通常のIDなら
        else {
            // チームIDを元にチーム名を取得
            const team = teams.find((team) => team.id === Number(teamId))
            return team ? `${team.name} ` : ''
        }
    }

    const isFixedMatchResultByMatchId = (matchId: string): boolean => {
        if (!matchPlans || !matchResults || !teams || !events) return false

        const matchResult = matchResults[matchId]
        return !!matchResult && matchResult.winnerTeamId !== null;

    }

    const isFixedMatchResultOrBlockRankByVariableId = (variableId: string): boolean => {
        if (!matchPlans || !matchResults || !teams || !events) return false

        if (!variableId.startsWith("$")) return false;
        const variableTeamIdData = analyzeVariableTeamId(variableId);
        if (variableTeamIdData === null) return false;

        if (variableTeamIdData.type === "T") { // 対象試合がトーナメント
            const matchId = variableTeamIdData.matchId
            const matchPlan = matchPlans.find((matchPlan) => matchPlan.id === matchId)
            if (!matchPlan) return false
            const matchResult = matchResults[matchId]
            return !!matchResult && matchResult.winnerTeamId !== null;
        }
        if (variableTeamIdData.type === "L") { // 対象試合がリーグ

            const eventId = variableTeamIdData.eventId
            const event = events.find((event) => event.id === eventId)
            if (!event) return false;
            const teamData = event.teamData as unknown as TeamData[]
            if (!teamData) return false;

            const teamDataIndex = variableTeamIdData.teamDataIndex
            const blockName = variableTeamIdData.blockName

            const expectedRank = variableTeamIdData.expectedRank
            const block = teamData[teamDataIndex].blocks![blockName]
            if (!block) return false
            const blockTeam = block.find((team) => team.rank === expectedRank)
            // 期待の順位のチームがいる (少なくともその変数でほしいブロックの結果があるかどうか)
            return !!blockTeam;
        }
        return false;
    }


    const searchMatchPlanByVariableId = (variableId: string): MatchPlan | null => {
        if (!matchPlans || !matchResults || !teams || !events) return null;

        const variableTeamIdData = analyzeVariableTeamId(variableId);
        if (!variableTeamIdData) return null;
        const matchType = variableTeamIdData.type

        if (matchType !== "T") return null;
        const matchId = variableTeamIdData.matchId
        const matchPlan = matchPlans.find((matchPlan) => matchPlan.id === matchId)
        if (matchPlan) return matchPlan
        return null;
    }

    const getLeagueDataByVariableId = (variableId: string): TeamData | null => {
        if (!matchPlans || !matchResults || !teams || !events) return null;

        const variableTeamIdData = analyzeVariableTeamId(variableId);
        if (!variableTeamIdData) return null;
        if (variableTeamIdData.type !== "L") return null;
        const event = events.find((event) => event.id === variableTeamIdData.eventId)
        if (!event) return null;
        const jsonData = event.teamData[variableTeamIdData.teamDataIndex];
        if (!jsonData) return null;
        return jsonData as unknown as TeamData
    }

    const getMatchResultByMatchId = (matchId: string | number): MatchResult | null => {
        if (!matchPlans || !matchResults || !teams || !events) return null;

        if (typeof matchId === "string" && matchId.startsWith("$")) return null;
        const matchResult = matchResults[matchId]
        if (matchResult) return matchResult
        return null;
    }


    return {
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
        // schedules,
        // scheduleLoading,
        // mutateSchedules,
        // eventSchedules,
        // eventScheduleLoading,
        // mutateEventSchedules,
        // setEventSchedules: setEventSchedulesx,
        // schedules,
        // setSchedules: setSchedulesx,
        getMatchDisplayStr,
        isFixedMatchResult: isFixedMatchResultByMatchId,
        isFixedMatchResultOrBlockRankByVariableId,
        searchMatchPlanByVariableId,
        getMatchResultByMatchId,
        getLeagueDataByVariableId,

    }
}