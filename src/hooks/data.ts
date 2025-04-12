import {useEffect, useState} from "react";
import {Event, EventSchedule, Location, MatchPlan, MatchResult, ScheduleImage, Score, Team} from "@prisma/client";
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";

export const useData = () => {
    const [teams, setTeams] = useState<Team[]>([])
    const [groupedTeams, setGroupedTeams] = useState<Record<string, Team[]>>({})

    const [events, setEvents] = useState<Event[]>([])
    const [eventSchedules, setEventSchedules] = useState<EventSchedule[]>([])
    const [matchPlans, setMatchPlans] = useState<MatchPlan[]>([])
    const [matchResults, setMatchResults] = useState<{ [key: string]: MatchResult }>({})
    const [schedules, setSchedules] = useState<ScheduleImage[]>([])
    const [locations, setLocations] = useState<Location[]>([])
    const [scores, setScores] = useState<Score[]>([])


    useEffect(() => {
        // nameの最初の1文字目でグルーピング
        setGroupedTeams(() => {
                const tmp = teams.reduce((acc: Record<string, Team[]>, team: Team) => {
                    const firstLetter = team.name.charAt(0).toUpperCase();
                    if (!acc[firstLetter]) {
                        acc[firstLetter] = [];
                    }
                    acc[firstLetter].push(team);
                    return acc;
                }, {})
                // 要素数が1つのグループはtmp["他"]にまとめる
                const otherGroups: Team[] = []
                for (const key in tmp) {
                    if (tmp[key].length === 1) {
                        otherGroups.push(tmp[key][0])
                        delete tmp[key]
                    }
                }
                if (otherGroups.length > 0) {
                    tmp['他'] = otherGroups
                }

                return {
                    ...tmp,
                }
            }
        )
    }, [teams])


    useEffect(() => {

        pullTeam()
        pullEvent()
        pullMatchPlan()
        pullMatchResult()
        pullLocation()

    }, [])

    const pullTeam = async (newResponse: any = undefined) => {
        if (newResponse) {
            setTeams(newResponse)
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/-1`)
            const teams = await response.json()
            setTeams(teams)
        }
    }

    const pullEvent = async (newResponse: any = undefined) => {
        if (newResponse) {
            setEvents(newResponse)
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/-1`)
            const events = await response.json()
            setEvents(events)
        }
    }

    const pullMatchPlan = async (newResponse: any = undefined) => {
        if (newResponse) {
            setMatchPlans(prevState =>
            {
                const a = [...prevState, newResponse]
                console.log(Object.is(prevState, a))
                return a;
                
            }    
            )
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match-plan/-1`)
            const matchPlans = await response.json()
            setMatchPlans(matchPlans)
        }
    }

    const pullMatchResult = async (newResponse: any = undefined) => {
        if (newResponse) {
            setMatchResults(newResponse)
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match-result/-1`)
            const matchResults = await response.json()
            setMatchResults(matchResults)
        }
    }


    // const pullEventSchedule = async (newResponse: any = undefined) => {
    //     if (newResponse) {
    //         setEventSchedulesnewResponse)
    //     } else {
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event-schedule/-1`)
    //         const eventSchedules = await response.json()
    //         setEventSchedules(eventSchedules)
    //     }
    // }
    // getEventSchedule()
    // const pullSchedule = async (newResponse: any = undefined) => {
    //     if (newResponse) {
    //         setSchedules(newResponse)
    //     } else {
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedule/-1`)
    //         const schedules = await response.json()
    //         setSchedules(schedules)
    //     }
    // }
    // getSchedule()
    const pullLocation = async (newResponse: any = undefined) => {
        if (newResponse) {
            setLocations(newResponse)
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/-1`)
            const locations = await response.json()
            setLocations(locations)
        }
    }

    // const pullScore = async (newResponse: any = undefined) => {
    //     if (newResponse) {
    //         setScores(newResponse)
    //     } else {
    //         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/score/-1`)
    //         const scores = await response.json()
    //         setScores(scores)
    //     }
    // }
    // getScore()


    const getMatchDisplayStr = (teamId: string | number): string => {

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
        const matchResult = matchResults[matchId]
        return !!matchResult && matchResult.winnerTeamId !== null;

    }

    const isFixedMatchResultOrBlockRankByVariableId = (variableId: string): boolean => {
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
        if (typeof matchId === "string" && matchId.startsWith("$")) return null;
        const matchResult = matchResults[matchId]
        if (matchResult) return matchResult
        return null;
    }

    useEffect(() => {
        console.log("matchPlans changed in data:",  matchPlans.length);
    }, [matchPlans]);
    
    return {
        pullTeam,
        pullEvent,
        pullMatchPlan,
        pullMatchResult,
        pullLocation,
        teams,
        setTeams,
        groupedTeams,
        events,
        setEvents,
        eventSchedules,
        setEventSchedules,
        matchPlans,
        setMatchPlans,
        matchResults,
        setMatchResults,
        schedules,
        setSchedules,
        locations,
        setLocations,
        scores,
        setScores,
        getMatchDisplayStr,
        isFixedMatchResult: isFixedMatchResultByMatchId,
        isFixedMatchResultOrBlockRankByVariableId,
        searchMatchPlanByVariableId,
        getMatchResultByMatchId,
        getLeagueDataByVariableId,

    }
}