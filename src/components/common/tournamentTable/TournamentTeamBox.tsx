import React, {useEffect, useMemo, useRef, useState} from "react";
import TournamentLine from "@/components/common/tournamentTable/TournamentLine";
import {TournamentNodeTeam} from "@/utils/tournamentUtils";
import {useData} from "@/hooks/data";

const TournamentTeamBox = ({node, rowWidth, rowHeight}: {
    node: TournamentNodeTeam
    rowWidth: number
    rowHeight: number
}) => {
    
    
    const {getMatchDisplayStr, getActualTeamIdByVariableId, matchResults} = useData()
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [lineCoords, setlineCoords] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        type: "H" as "H" | "V" | "LT" | "RT" | "LB" | "RB",
    });


    useEffect(() => {
        // 大きさを監視
        const observer = new ResizeObserver(() => {
            if (boxRef.current) {
                const box = boxRef.current.getBoundingClientRect();
                if (!node.nextNode) return;

                const rowDiff = node.nextNode.row - node.row
                const colDiff = node.nextNode.column - node.column // チームは常に左端に配置しているので常に正
                
                
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
    
    const isWonInNextNode = useMemo(() => {
        const nextNode = node.nextNode
        if (!matchResults || !nextNode || nextNode?.type === "team") return false
        const actualId = getActualTeamIdByVariableId(node.teamId.toString())
        if (!actualId) return false;
        const result = matchResults[nextNode.matchId]  
        if (!result) return false;
        return result.winnerTeamId === actualId
        
    }, [getActualTeamIdByVariableId, matchResults, node.nextNode, node.teamId])
    
    
    return (
        <div
            className={`flex justify-end items-center p-2 relative h-10 w-full `}
            ref={boxRef}
        >
            <span className="max-w-[180px]">{displayStr}</span>
            
            {
                <TournamentLine startX={lineCoords.startX}
                                startY={lineCoords.startY}
                                endX={lineCoords.endX}
                                endY={lineCoords.endY}
                                type={lineCoords.type}
                                // color1={ "rgb(255,0,0)" }
                                color1={ isWonInNextNode ? "rgb(255,0,0)" : "rgba(156, 163, 175, 1)"}
                                color2={ isWonInNextNode ? "rgb(255,0,0)" : "rgba(156, 163, 175, 1)"}
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