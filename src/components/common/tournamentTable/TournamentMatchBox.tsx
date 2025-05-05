import React, {CSSProperties, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {TournamentNodeMatch} from "@/utils/tournamentUtils";
import {MatchResult, Status} from "@prisma/client";
import TournamentLine from "@/components/common/tournamentTable/TournamentLine";
import {useData} from "@/hooks/data";
import {statusColors} from "@/components/dashboard/matchPlan/constants";

const TournamentMatchBox = ({match, boxStyle, matchResult, rowWidth, rowHeight}: {
    match: TournamentNodeMatch,
    boxStyle: CSSProperties,
    matchResult?: MatchResult
    rowWidth: number
    rowHeight: number
}) => {
    
    const {matchResults} = useData()

    const matchBoxRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [lineCoords, setLineCoords] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        type: "H" as "H" | "V" | "LT" | "RT" | "LB" | "RB",
    });

    // リサイズ時や初回レンダリング時に座標を再計算
    const calculateLineCoordinates = useCallback(() => {

        if (!matchBoxRef.current || !wrapperRef.current) return;
        const box = matchBoxRef.current.getBoundingClientRect();
        let rowDiff;
        let colDiff;
        if (match.nextNode) {
        rowDiff = match.nextNode.row - match.row
         colDiff = match.nextNode.column - match.column
        }else {
            rowDiff = 0
            colDiff = 1
        }

        const startX = box.width;
        const endX = box.width + (colDiff) * rowWidth;
        let startY = box.height / 2;
        let endY = box.height / 2;
        let type: "H" | "V" | "LT" | "RT" | "LB" | "RB";


        if (rowDiff > 0) {
            startY = box.height / 2;
            endY = box.height / 2 + (rowDiff) * rowHeight;
            type = "RT";
        } else if (rowDiff < 0) {
            startY = box.height / 2 + (rowDiff) * rowHeight;
            endY = box.height / 2;
            type = "RB";
        } else {
            type = "H"

        }

        setLineCoords({startX, startY, endX, endY, type});

    }, [match.column, match.nextNode, match.row, rowHeight, rowWidth]);

    // 次のノードとの接続線のための座標計算
    useEffect(() => {
            // 座標計算と監視設定
            const observer = new ResizeObserver(() => {
                calculateLineCoordinates();
            });

            if (matchBoxRef.current) {
                calculateLineCoordinates();
                observer.observe(matchBoxRef.current);
            }

            return () => {
                if (matchBoxRef.current) {
                    observer.unobserve(matchBoxRef.current);
                }
            };
        }, [calculateLineCoordinates]
    );
    
    const isWonInNextNode = useMemo(() => {
        if (!matchResult || !matchResults || !match.nextNode || match.nextNode?.type === "team" || !matchResults[match.nextNode.matchId]) return false
        return (matchResults[match.nextNode.matchId].winnerTeamId === matchResult.winnerTeamId)
    }, [match.nextNode, matchResult, matchResults])
        
        
    const matchStatusColor = useMemo(() => {
        const statusColors = {
            Waiting: "text-blue-200",
            Preparing: "text-blue-500",
            Playing: "text-green-600",
            Finished: "text-yellow-500",
            Completed: "text-gray-300",
            Cancelled: "text-orange-300",
        }

        return statusColors[match.tournamentMatchNode.matchPlan.status]
    }, [match.tournamentMatchNode.matchPlan.status])
        

    return (
        <div
            className={"h-full relative w-full "}
            style={boxStyle}
            ref={wrapperRef}
        >
            {!!match.matchId && (
                <div
                    className="text-md text-gray-500 pr-2 absolute  h-full w-full flex justify-end items-center bg-transparent">
                    <p className={matchStatusColor + " font-bold text-[1.2em]"}>{match.tournamentMatchNode.matchPlan.matchName}</p>
                </div>
            )}

            <div className="relative h-full" ref={matchBoxRef}>
                <TournamentLine
                    key={"match-"+match.matchId+"-line-"+(match.tournamentMatchNode.matchPlan.status === Status.Completed).toString()}
                    startX={lineCoords.startX}
                    startY={lineCoords.startY}
                    endX={lineCoords.endX}
                    endY={lineCoords.endY}
                    type={lineCoords.type}
                    color1={match.tournamentMatchNode.matchPlan.status === Status.Completed ? "rgb(255,0,0)" : "rgba(156, 163, 175, 0.8)"}
                    color2={isWonInNextNode ? "rgb(255,0,0)" : "rgba(156, 163, 175, 0.8)"}
                    thickness={4}
                    animationTimingFunction={"linear"}
                    duration={200}
                    timeout={(match.column) * 200 + 200}
                />
            </div>

            


        </div>
    )
}

export default TournamentMatchBox;
