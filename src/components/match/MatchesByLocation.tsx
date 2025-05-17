import {RefObject, UIEventHandler, useEffect, useMemo, useRef, useState} from "react";
import {Event, Location, MatchPlan} from "@prisma/client";
import MatchCard from "@/components/match/MatchCard";
import {useDataContext} from "@/contexts/dataContext";

const MatchesByLocation = ({location, onScroll, refs, isShowCompletedMatch = false}: {
    location: Location,
    onScroll: UIEventHandler<HTMLDivElement>,
    refs: RefObject<HTMLDivElement[]>,
    isShowCompletedMatch: boolean
}) => {
    const {matchPlans, locations, events, matchResults} = useDataContext()
    const [matchesInLocation, setMatchesInLocation] = useState<MatchPlan[]>([])
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const [fontSize, setFontSize] = useState(16);

    useEffect(() => {
        if (!scrollerRef.current || refs.current.includes(scrollerRef.current)) return
        refs.current.push(scrollerRef.current)

        return () => {
            refs.current = refs.current.filter(ref => ref !== scrollerRef.current)
        }
    }, [refs, scrollerRef]);

    const handleResize = () => {
        if (wrapperRef.current) {
            const width = wrapperRef.current.clientWidth;
            const newFontSize = Math.max(16, Math.floor(width / 20));
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
        const relatedMatchPlans: MatchPlan[] = matchPlans.filter(matchPlan => (matchPlan.locationId === location.id) && (isShowCompletedMatch || matchPlan.status !== "Completed"))
        // 開始時刻で並べ替え
        relatedMatchPlans.sort((a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime())
        setMatchesInLocation(relatedMatchPlans)


    }, [isShowCompletedMatch, location.id, locations, matchPlans])


    return (
        <div className={"w-full h-full flex flex-col items-center max-w-[512px] "} style={{fontSize: fontSize + "px"}}
             ref={wrapperRef}>
            <div
                className={"ml-8 pr-8 mt-5 pb-2 w-full text-4xl font-bold border-b-2 [border-image:linear-gradient(to_right,#888,#888_60%,#eee)_1]"}>
                {location.name}
            </div>

            <div
                className={"flex flex-col items-center px-4 m-8 space-y-8 pt-4 pb-12 w-full overflow-x-scroll overscroll-none hidden-scrollbar"}
                onScroll={onScroll}
                ref={scrollerRef}
            >
                {matchesInLocation.map(match =>
                    <MatchCard key={"matches-" + match.id} match={match} eventsById={eventsById}
                               matchResults={matchResults}/>
                )}
            </div>
        </div>
    )
}

export default MatchesByLocation;