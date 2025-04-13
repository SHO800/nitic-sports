import React, {useEffect, useRef, useState} from "react";
import {TournamentNode} from "@/utils/tournamentUtils";
import {useData} from "@/hooks/data";
import TournamentTeamBox from "@/components/common/TournamentTeamBox";
import TournamentLine from "@/components/common/TournamentLine";

const TournamentBoxWrapper = ({roundNumber, match}: { roundNumber: number, match: TournamentNode }) => {
    const {getMatchDisplayStr} = useData();

    const matchBoxRef = useRef<HTMLDivElement | null>(null);
    const [horizontalLineCoordinates, setHorizontalLineCoordinates] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    });

    const [verticalLineCoordinates, setVerticalLineCoordinates] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    });


    useEffect(() => {
        //     監視
        const observer = new ResizeObserver(() => {
            if (matchBoxRef.current ) {
                const box = matchBoxRef.current.getBoundingClientRect();
                const childCount = matchBoxRef.current.childElementCount;
                
                
                const startX = box.width + 10;
                const endX = box.width + 12;
                const startY =  box.height  / childCount - 2; // 2は太さ
                const endY = box.height * ( childCount - 1) / childCount - 2;

                setVerticalLineCoordinates({startX, startY, endX, endY});
                
                const horizontalStartX = box.width + 12;
                const horizontalEndX = box.width + 24;
                const horizontalStartY = box.height / 2 - 2;
                const horizontalEndY = box.height / 2 + 2;
                setHorizontalLineCoordinates({startX: horizontalStartX, startY: horizontalStartY, endX: horizontalEndX, endY: horizontalEndY});
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
            className="flex flex-col"
            style={{
                marginBottom: roundNumber > 1 ? `${Math.pow(2, roundNumber - 1) * 3 - 2}rem` : '1rem'
            }}
        >
            {match.matchId && (
                <div className="text-md text-gray-500 mb-1">
                    <p>{match.matchPlan.matchName ?? `Match #${match.matchId}`}
                        {match.matchPlan.matchNote && (
                            <span
                                className="ml-2 text-gray-400">{match.matchPlan.matchNote}</span>
                        )}
                    </p>
                </div>

            )}

            <div className="border border-gray-200 rounded relative shadow-sm" ref={matchBoxRef}>
                {match.premiseNode?.map((child, idx) => (
                    <TournamentTeamBox key={`team-${idx}-${match.matchId}`}
                                       displayStr={getMatchDisplayStr(match.teamIds[idx])} color={"#000000"}/>

                ))}
            <TournamentLine startX={verticalLineCoordinates.startX}
                            startY={verticalLineCoordinates.startY}
                            endX={verticalLineCoordinates.endX}
                            endY={verticalLineCoordinates.endY}
                            isVertical={true}
                            color={"#000000"}
                            thickness={2}
                             />
                <TournamentLine startX={horizontalLineCoordinates.startX}
                                startY={horizontalLineCoordinates.startY}
                                endX={horizontalLineCoordinates.endX}
                                endY={horizontalLineCoordinates.endY}
                                isVertical={false}
                                color={"#000000"}
                                thickness={2}
                />
            </div>
        </div>
    )


}
export default TournamentBoxWrapper;