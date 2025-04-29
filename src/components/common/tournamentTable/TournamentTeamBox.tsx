import React, {useEffect, useRef, useState} from "react";
import TournamentLine from "@/components/common/tournamentTable/TournamentLine";
import {TournamentNodeTeam} from "@/utils/tournamentUtils";
import {useData} from "@/hooks/data";

const TournamentTeamBox = ({node, rowWidth, rowHeight}: {
    node: TournamentNodeTeam
    rowWidth: number
    rowHeight: number
}) => {
    
    
    const {getMatchDisplayStr} = useData()
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [lineCoords, setlineCoords] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        type: "H" as "H" | "V" | "LT" | "RT" | "LB" | "RB",
    });
    const [diffs, setDiffs] = useState({
        rowDiff: 0,
        colDiff: 0
    })


    useEffect(() => {
        // 大きさを監視
        const observer = new ResizeObserver(() => {
            if (boxRef.current) {
                const box = boxRef.current.getBoundingClientRect();
                if (!node.nextNode) return;

                const rowDiff = node.nextNode.row - node.row
                const colDiff = node.nextNode.column - node.column // チームは常に左端に配置しているので常に正
                setDiffs({rowDiff, colDiff})
                
                
                let startX = box.width ;
                const endX = box.width + (colDiff-1) * rowWidth ;
                let startY = box.height /2;
                let endY = box.height /2;
                let type = "H" as "H" | "V" | "LT" | "RT" | "LB" | "RB";
                
                
                if (rowDiff > 0) {
                    endY += (rowDiff)*rowHeight -4;
                    type = "RT";
                }else if (rowDiff < 0) {
                    startY += (rowDiff)*rowHeight-6;
                    endY += 4;
                    type = "RB";
                }else {
                    startY--;
                    startX--;
                    type = "H"

                }

                setlineCoords({startX, startY, endX, endY, type});
            }
        });

        if (boxRef.current) {
            observer.observe(boxRef.current);
        }

        return () => {
            if (boxRef.current) {
                observer.unobserve(boxRef.current);
            }
        };

    }, [node.column, node.nextNode, node.row, rowHeight, rowWidth]);


    const displayStr = getMatchDisplayStr(node.teamId)
    return (
        <div
            className={`flex justify-between items-center p-2 relative h-10 w-full `}
            ref={boxRef}
        >
            <span className="truncate max-w-[180px]">{displayStr}</span>
            
            {
                <TournamentLine startX={lineCoords.startX}
                                startY={lineCoords.startY}
                                endX={lineCoords.endX}
                                endY={lineCoords.endY}
                                type={lineCoords.type}
                                color={false ? "rgb(255,0,0)" : "rgba(156, 163, 175, 1)"}
                                thickness={4}
                                animationTimingFunction={"linear"}
                                duration={200}
                                timeout={200}
                />
            }

        </div>
    )
}

export default TournamentTeamBox;