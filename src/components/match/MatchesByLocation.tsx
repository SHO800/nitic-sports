import {useData} from "@/hooks/data";
import {Fragment, useEffect, useMemo, useRef, useState} from "react";
import {Event, Location, MatchPlan} from "@prisma/client";

const MatchesByLocation = ({locationId}: { locationId: number }) => {
    const {matchPlans, locations, events, getMatchDisplayStr} = useData()
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
    const [matchesInLocation, setMatchesInLocation] = useState<MatchPlan[]>([])
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [fontSize, setFontSize] = useState(16);
    
    const handleResize = () => {
        if (wrapperRef.current) {
            const width = wrapperRef.current.clientWidth;
            const newFontSize = Math.max(16, Math.floor(width / 20)); // Adjust the divisor to control the scaling
            setFontSize(newFontSize);
        }
    }
    
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [wrapperRef]);

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
        <div className={"w-full h-full flex flex-col items-center"} style={{fontSize: fontSize+"px"}} ref={wrapperRef}>
            <div
                className={"ml-8 pr-8 mt-5 pb-2 w-full text-4xl font-bold border-b-2 [border-image:linear-gradient(to_right,#888,#888_60%,#eee)_1]"}>
                {currentLocation?.name}
            </div>

            <div className={"flex flex-col items-center px-4 m-8 space-y-4 w-full overflow-x-scroll overscroll-none"}>
                {matchesInLocation.map(match => {
                    const teamsDisplayNames = match.teamIds.map(teamId => getMatchDisplayStr(teamId))

                    return (
                        // card
                        <div key={"matches-" + match.id}
                             className={"w-full px-4 py-2  border border-gray-500 rounded "}
                        >
                            {/*ヘッダ*/}
                            <div className={"flex flex-row justify-between space-x-4 w-full "}>
                                <p className={"font-bold m-0"}>{match.matchName} <small
                                    className={"text-gray-500 ml-1 font-normal"}>#{match.id}</small></p>
                                <p className={"text-[.9em] mt-auto mb-1 w-fit whitespace-nowrap min-w-16  "}>{eventsById[match.eventId]?.name}</p>
                            </div>
                            
                            {/*開始時間等*/}
                            <p className={"text-[.9em] mt-auto mb-1 w-fit whitespace-nowrap min-w-16  "}>
                                {new Date(match.scheduledStartTime).toLocaleString("ja-JP", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}
                            </p>
                            
                            {/*対戦チーム等*/}
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
                            
                            {/*    操作ボタン*/}
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