import {useData} from "@/hooks/data";
import {Fragment, useEffect, useMemo, useState} from "react";
import {Event, Location, MatchPlan} from "@prisma/client";

const MatchesByLocation = ({locationId}: { locationId: number }) => {
    const {matchPlans, locations, events, getMatchDisplayStr} = useData()
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
    const [matchesInLocation, setMatchesInLocation] = useState<MatchPlan[]>([])

    const eventsById = useMemo(() => {
        if (!events) return {}
        const result: Record<number, Event> = {}
        const eventIds = events.map(event => event.id)
        eventIds.forEach(id => {
            const event = events.find(event => event.id === id)
            if (event) result[id] = event
        })
        return result
    }, [events])


    useEffect(() => {
        if (!locations || !matchPlans) return;
        const location = locations.find(location => location.id.toString() === locationId) ?? null
        if (!location) return;
        setCurrentLocation(location)
        const relatedMatchPlans: MatchPlan[] = matchPlans.filter(matchPlan => matchPlan.locationId === location.id)


        // 開始時刻で並べ替え
        relatedMatchPlans.sort((a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime())
        setMatchesInLocation(relatedMatchPlans)


    }, [locations, locationId])

    return (
        <div className={"w-full h-full flex flex-col items-center"}>
            <div
                className={"ml-8 pr-8 mt-5 pb-2 w-full text-4xl font-bold border-b-2 [border-image:linear-gradient(to_right,#888,#888_60%,#eee)_1]"}>
                {currentLocation?.name}
            </div>

            <div className={"flex flex-col items-center m-8 space-y-4 w-full overflow-x-scroll overscroll-none"}>
                {matchesInLocation.map(match => {
                    const teamsDisplayNames = match.teamIds.map(teamId => getMatchDisplayStr(teamId))

                    return (
                        // card
                        <div key={"matches-" + match.id}
                             // className={"h-[min(70vh,70vw)] aspect-[0.7071067812] px-4 py-2  border border-gray-500 rounded text-[min(4vh,4vw)]"}
                             className={" px-4 py-2  border border-gray-500 rounded "}
                        >
                            <div className={"flex flex-row justify-between space-x-4 w-full "}>
                                <p className={"font-bold m-0"}>{match.matchName} <small
                                    className={"text-gray-500 ml-1 font-normal"}>#{match.id}</small></p>
                                <p className={"text-[.9em] mt-auto mb-1 w-fit whitespace-nowrap min-w-16  "}>{eventsById[match.eventId]?.name}</p>
                            </div>
                            <p className={"flex flex-row justify-center space-x-8 border-y-[2px] border-y-gray-400"}>
                                {teamsDisplayNames.map((teamName, index) => {
                                    return (
                                        <Fragment
                                            key={"location-" + currentLocation + "-" + "match-" + match.id + "-" + index}>
                                            {index !== 0 && <span className={"text-[.8em] mt-auto mb-1"}>vs</span>}
                                            <span>{teamName}</span>
                                        </Fragment>
                                    )
                                })}
                            </p>
                            <div className={"flex flex-row justify-start"}>


                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MatchesByLocation