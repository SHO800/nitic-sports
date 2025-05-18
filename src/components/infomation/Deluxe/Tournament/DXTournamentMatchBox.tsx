import React, {CSSProperties, useCallback, useEffect, useRef, useState} from "react";
import {TournamentNodeMatch} from "@/utils/tournamentUtils";
import {MatchResult} from "@prisma/client";
import TournamentLine from "@/components/common/tournamentTable/TournamentLine";
import {useDataContext} from "@/contexts/dataContext";

const DXTournamentMatchBox = ({match, boxStyle, matchResult, rowWidth, rowHeight, teamIds}: {
    match: TournamentNodeMatch,
    boxStyle: CSSProperties,
    matchResult?: MatchResult
    rowWidth: number
    rowHeight: number
    teamIds: string[]
}) => {
    // const {boxNodes, registerNode} = useTournamentBracket();

    const matchBoxRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [lineCoords, setLineCoords] = useState({
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

    // リサイズ時や初回レンダリング時に座標を再計算
    const calculateLineCoordinates = useCallback(() => {

        if (!match.nextNode) return;
        if (!matchBoxRef.current || !wrapperRef.current) return;


        const box = matchBoxRef.current.getBoundingClientRect();
        const rowDiff = match.nextNode.row - match.row
        const colDiff = match.nextNode.column - match.column
        setDiffs({rowDiff, colDiff})

        let startX = box.width;
        let endX = box.width + (colDiff) * rowWidth;
        let startY = box.height / 2;
        let endY = box.height / 2;
        let type = "H" as "H" | "V" | "LT" | "RT" | "LB" | "RB";


        if (rowDiff > 0) {
            startX = box.width;
            endX = box.width + (colDiff) * rowWidth;
            startY = box.height / 2;
            endY = box.height / 2 + (rowDiff) * rowHeight;
            type = "RT";
        } else if (rowDiff < 0) {
            startX = box.width;
            endX = box.width + (colDiff) * rowWidth;
            startY = box.height / 2 + (rowDiff) * rowHeight;
            endY = box.height / 2;
            // endY += 4;
            type = "RB";
        } else {
            startY--;
            startX--;
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

    return (
        <div
            className={"h-full relative w-full "}
            style={boxStyle}
            ref={wrapperRef}
        >
            {match.matchId && (
                <div className="text-md text-gray-500 pr-2 absolute  h-full w-full flex justify-end items-center">
                    <p className={`${(match.tournamentMatchNode.matchPlan.teamIds === teamIds) ? "bg-amber-500 text-white rounded" : ""}`}>
                        <p className={`${(match.tournamentMatchNode.matchPlan.teamIds === teamIds) ? "animate-pulse text-3xl" : ""}`}>{match.tournamentMatchNode.matchPlan.matchName}</p>
                    </p>

                    {/*<p>{match.tournamentMatchNode.matchPlan.matchName} {`#${match.matchId}`} @{match.row}a*/}
                    {/*    {match.nextNode && match.nextNode.type === "match" && match.matchId}*/}
                    {/*    {match.tournamentMatchNode.matchPlan.matchNote && (*/}
                    {/*        */}
                    {/*        <span*/}
                    {/*            className="ml-2 text-gray-400">{match.tournamentMatchNode.matchPlan.matchNote}</span>*/}
                    {/*    )}*/}
                    {/*    */}
                    {/*</p>*/}
                </div>
            )}

            <div className="relative h-full" ref={matchBoxRef}>
                <TournamentLine
                    startX={lineCoords.startX}
                    startY={lineCoords.startY}
                    endX={lineCoords.endX}
                    endY={lineCoords.endY}
                    type={lineCoords.type}
                    color={false ? "rgb(255,0,0)" : "rgba(156, 163, 175, 0.8)"}
                    thickness={4}
                    // animationTimingFunction={"ease-out"}
                    animationTimingFunction={"linear"}
                    duration={200}
                    timeout={(match.column) * 200 + 200}
                />
            </div>


        </div>
    )
}

export default DXTournamentMatchBox;
