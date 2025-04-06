import {useEffect, useState} from "react";
import {Event, EventSchedule, Location, MatchPlan, MatchResult, ScheduleImage, Score, Team} from "@prisma/client";

export const useData = () => {
    const [teams, setTeams] = useState<Team[]>([])
    const [groupedTeams, setGroupedTeams] = useState<Record<string, Team[]>>({})

    const [events, setEvents] = useState<Event[]>([])
    const [eventSchedules, setEventSchedules] = useState<EventSchedule[]>([])
    const [matchPlans, setMatchPlans] = useState<MatchPlan[]>([])
    const [matchResults, setMatchResults] = useState<MatchResult[]>([])
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
        const getTeam = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/-1`)
            const teams = await response.json()
            setTeams(teams)
        }
        getTeam()

        const getEvent = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/-1`)
            const events = await response.json()
            setEvents(events)
        }
        getEvent()

        const getMatchPlan = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match-plan/-1`)
            const matchPlans = await response.json()
            setMatchPlans(matchPlans)
        }
        getMatchPlan()
    }, [])
    
    
    return {
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
        setScores
    }
}