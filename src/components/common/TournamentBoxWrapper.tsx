import React, {CSSProperties, useEffect, useRef, useState} from "react";
import {implementsTournamentNode, TournamentNode} from "@/utils/tournamentUtils";
import {useData} from "@/hooks/data";
import TournamentTeamBox from "@/components/common/TournamentTeamBox";
import TournamentLine from "@/components/common/TournamentLine";

const TournamentBoxWrapper = ({roundNumber, match, boxStyle}: {
    roundNumber: number,
    match: TournamentNode,
    boxStyle: CSSProperties
}) => {
    const {getMatchDisplayStr} = useData();

    const matchBoxRef = useRef<HTMLDivElement | null>(null);
    const [afterHorizontalLineCoordinates, setAfterHorizontalLineCoordinates] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    });

    const [afterVerticalLineCoordinates, setAfterVerticalLineCoordinates] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    });
    


    useEffect(() => {
        //     監視
        const observer = new ResizeObserver(() => {
            if (matchBoxRef.current) {
                const box = matchBoxRef.current.getBoundingClientRect();
                const childCount = matchBoxRef.current.childElementCount;


                const startX = box.width;
                const startY = box.height / childCount - 2; // 2は太さ
                const endX = box.width + box.height / childCount;
                const endY = box.height / (childCount-1) - 2;

                setAfterVerticalLineCoordinates({startX, startY, endX, endY});
                
            }
        });

        if (matchBoxRef.current) {
            observer.observe(matchBoxRef.current);
        }

        return () => {
            if (matchBoxRef.current) {
                observer.unobserve(matchBoxRef.current);
            }
        };

    }, []);

    return (
        <div
            className={"h-20 relative pl-14"}
            style={boxStyle}
        >
            {match.matchId && (
                <div className="text-md text-gray-500 mb-1 absolute translate-y-[-100%]">
                    <p>{match.matchPlan.matchName} {`#${match.matchId}`} @{match.row}
                        {match.matchPlan.matchNote && (
                            <span
                                className="ml-2 text-gray-400">{match.matchPlan.matchNote}</span>
                        )}
                    </p>
                </div>
            )}

            <div className="border border-gray-200 rounded relative shadow-sm " ref={matchBoxRef}>
                {match.premiseNode?.map((child, idx) => (
                    <>
                    <TournamentTeamBox key={`team-${idx}-${match.matchId}`}
                                       displayStr={getMatchDisplayStr(match.teamIds[idx])} color={"#000000"}/>
                        {
                            implementsTournamentNode(child) && 
                            <div key={`team-${idx}-${match.matchId}-div`} className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                
                            </div>
                        }

                    </>
                ))}
                {/*<TournamentLine startX={afterVerticalLineCoordinates.startX}*/}
                {/*                startY={afterVerticalLineCoordinates.startY}*/}
                {/*                endX={afterVerticalLineCoordinates.endX}*/}
                {/*                endY={afterVerticalLineCoordinates.endY}*/}
                {/*                isVertical={true}*/}
                {/*                color={"#000000"}*/}
                {/*                thickness={2}*/}
                {/*/>*/}
                {/*<TournamentLine startX={afterHorizontalLineCoordinates.startX}*/}
                {/*                startY={afterHorizontalLineCoordinates.startY}*/}
                {/*                endX={afterHorizontalLineCoordinates.endX}*/}
                {/*                endY={afterHorizontalLineCoordinates.endY}*/}
                {/*                isVertical={false}*/}
                {/*                color={"#000000"}*/}
                {/*                thickness={2}*/}
                {/*/>*/}
                <TournamentLine startX={afterVerticalLineCoordinates.startX}
                                startY={afterVerticalLineCoordinates.startY} 
                                endX={afterVerticalLineCoordinates.endX}
                                endY={afterVerticalLineCoordinates.endY}
                                type={"RT"}
                                 color={"#000000"} thickness={2} />
            </div>
        </div>
    )


}
export default TournamentBoxWrapper;