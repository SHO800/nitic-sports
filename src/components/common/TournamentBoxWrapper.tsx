import React, {CSSProperties, Fragment, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {implementsTournamentNode, TournamentNode} from "@/utils/tournamentUtils";
import {useData} from "@/hooks/data";
import TournamentTeamBox from "@/components/common/TournamentTeamBox";
import {MatchResult} from "@prisma/client";
import {useTournamentBracket} from "@/contexts/TournamentBracketContext";
import TournamentLine from "@/components/common/TournamentLine";
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";

const TournamentBoxWrapper = ({isFinal, roundNumber, match, boxStyle, matchResult}: {
    isFinal: boolean,
    roundNumber: number,
    match: TournamentNode,
    boxStyle: CSSProperties,
    matchResult?: MatchResult
}) => {
    const {getMatchDisplayStr, getActualTeamIdByVariableId} = useData();
    const {boxNodes, registerNode} = useTournamentBracket();

    const matchBoxRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [horizontalLine1Coords, setHorizontalLine1Coords] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
    });
    const [verticalLineCoords, setVerticalLineCoords] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
    });
    const [horizontalLine2Coords, setHorizontalLine2Coords] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
    });


    // 現在のマッチを前提とする次のノード
    const nextNode = useMemo(() => {
        if (match.nextNode) {
            return boxNodes[match.nextNode.matchId];
        }
        return null;
    }, [match.nextNode, boxNodes]);


    // このボックスのRefをコンテキストに登録
    useEffect(() => {
        if (match.matchId && wrapperRef.current) {
            registerNode(match.matchId, match)
        }
    }, [match, match.matchId, registerNode]);
    // リサイズ時や初回レンダリング時に座標を再計算
    const calculateLineCoordinates = useCallback(() => {

        if (!matchBoxRef.current || !nextNode || !wrapperRef.current) return;
        const currentBoxRect = matchBoxRef.current.getBoundingClientRect();


        // 1行の高さ
        const rowHeight = 80;
        const rowWidth = 224;
        const rowPaddingX = 56;
        const teamBoxHeight = 20;

        const currentRow = match.row;
        const nextRow = nextNode.row;
        const rowDiff = nextRow - currentRow;
        const currentRound = match.round;
        const nextRound = nextNode.round;
        // const rowSpan = Math.abs(rowDiff) + 1;
        const roundDiff = nextRound - currentRound;

        let type: "H" | "V" | "LT" | "RT" | "LB" | "RB";
        if (rowDiff === 0) {
            type = "H";
        } else if (rowDiff > 0) {
            type = "V";
        } else {
            type = "H";
        }
        const nextNodeTargetRowIndex = nextNode.premiseNode?.findIndex(nextNodePremise => {
            if (implementsTournamentNode(nextNodePremise)) {
                return nextNodePremise.matchId === match.matchId;
            } else if (!nextNodePremise) {
                return false;
            } else {
                for (const element of nextNodePremise) {
                    const at = analyzeVariableTeamId(element)
                    if (at?.type === "T" && at.matchId === match.matchId) {
                        return true;
                    }
                }
            }
            return false;
        })
        if (nextNodeTargetRowIndex === undefined) {
            return;
        }


        setHorizontalLine1Coords({
            startX: currentBoxRect.width + 10,
            startY: currentBoxRect.height / 2,
            endX: currentBoxRect.width + (rowWidth * (roundDiff - 1)) + 10 + 22,
            endY: currentBoxRect.height / 2,
        })

        setVerticalLineCoords({
            startX: currentBoxRect.width + (rowWidth * (roundDiff - 1)) + 10 + 20,
            startY: currentBoxRect.height / 2,
            endX: currentBoxRect.width + (rowWidth * (roundDiff - 1)) + 10 + 20,
            endY: rowHeight * rowDiff + teamBoxHeight * (nextNodeTargetRowIndex * 2 + 1),
        })
        setHorizontalLine2Coords({
            startX: currentBoxRect.width + (rowWidth * (roundDiff - 1)) + 10 + 20,
            startY: rowHeight * rowDiff + teamBoxHeight * (nextNodeTargetRowIndex * 2 + 1),
            endX: currentBoxRect.width + (rowWidth * (roundDiff - 1)) + 10 + 46,
            endY: rowHeight * rowDiff + teamBoxHeight * (nextNodeTargetRowIndex * 2 + 1),
        })
    }, [nextNode, match.matchId, match.row, match.round]);

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
        }, [nextNode, match.matchId, match.row, match.round, calculateLineCoordinates]
    );

    return (
        <div
            className={"h-20 relative pl-14"}
            style={boxStyle}
            ref={wrapperRef}
        >
            {match.matchId && (
                <div className="text-md text-gray-500 mb-1 absolute translate-y-[-100%]">
                    <p>{match.matchPlan.matchName} {`#${match.matchId}`} @{match.row}a
                        {nextNode && nextNode.matchId}
                        {match.matchPlan.matchNote && (
                            <span
                                className="ml-2 text-gray-400">{match.matchPlan.matchNote}</span>
                        )}
                    </p>
                </div>
            )}

            <div className="border border-gray-200  rounded relative shadow-sm " ref={matchBoxRef}>
                {match.premiseNode?.map((child, idx) => {
                    let processedTeamId: string | number | null = getActualTeamIdByVariableId(match.teamIds[idx])
                    if (!processedTeamId) processedTeamId = match.teamIds[idx].toString()
                    return (
                        <Fragment key={`team-${idx}-${match.matchId}-frag-${match.matchId}`}>
                            <TournamentTeamBox key={`team-${idx}-${match.matchId}`}
                                               isFinal={isFinal}
                                               displayStr={getMatchDisplayStr(match.teamIds[idx])}
                                               boxLength={match.teamIds.length}
                                               boxIndex={idx}
                                               roundNumber={roundNumber}
                                               isWon={matchResult ? matchResult.winnerTeamId.toString() === processedTeamId.toString() : false}
                            />

                        </Fragment>
                    )
                })}
                <TournamentLine
                    startX={horizontalLine1Coords.startX}
                    startY={horizontalLine1Coords.startY}
                    endX={horizontalLine1Coords.endX}
                    endY={horizontalLine1Coords.endY}
                    type={"H"}
                    color={matchResult ? "rgb(255,0,0)" : "rgba(156, 163, 175, 0.8)"}
                    thickness={4}
                    animationTimingFunction={"ease-in"}
                    duration={200}
                    timeout={(roundNumber - 1) * 1000 + 400}
                />
                <TournamentLine
                    startX={verticalLineCoords.startX}
                    startY={verticalLineCoords.startY}
                    endX={verticalLineCoords.endX}
                    endY={verticalLineCoords.endY}
                    type={"V"}
                    color={matchResult ? "rgb(255,0,0)" : "rgba(156, 163, 175, 0.8)"}
                    thickness={4}
                    animationTimingFunction={"ease-out"}
                    duration={200}
                    timeout={(roundNumber - 1) * 1000 + 600}
                />
                <TournamentLine
                    startX={horizontalLine2Coords.startX}
                    startY={horizontalLine2Coords.startY}
                    endX={horizontalLine2Coords.endX}
                    endY={horizontalLine2Coords.endY}
                    type={"H"}
                    color={matchResult ? "rgb(255,0,0)" : "rgba(156, 163, 175, 0.8)"}
                    thickness={4}
                    animationTimingFunction={"linear"}
                    duration={200}
                    timeout={(roundNumber - 1) * 1000 + 800}
                />
            </div>


        </div>
    )
}

export default TournamentBoxWrapper;
