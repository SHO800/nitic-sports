import {MatchPlan, MatchResult} from "@prisma/client";
import React, {CSSProperties, Fragment, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    buildTournamentBracket,
    implementsTournamentNode,
    TournamentData,
    TournamentNode
} from "@/utils/tournamentUtils";
import {useData} from "@/hooks/data";
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";
import TournamentLine from "@/components/common/TournamentLine";


interface TournamentBracketProps {
    eventId: number;
    isFinal: boolean;
    relatedMatchPlans: MatchPlan[];
}

const TournamentTable = ({eventId, isFinal, relatedMatchPlans}: Readonly<TournamentBracketProps>) => {
    const {
        events,
        eventLoading,
        matchPlanLoading,
        matchPlans,
        matchResultLoading,
        matchResults,
        teams,
        teamLoading,
        getMatchDisplayStr,
    } = useData();

    const rowWidth = 224;
    const rowHeight = 40;

    // データ取得後にトーナメント構造を構築
    const tournamentData = useMemo((): TournamentData | null => {
        if (eventLoading || matchPlanLoading || matchResultLoading || teamLoading) {
            return null;
        }

        // イベントが見つからない場合
        const event = events?.find(e => e.id === eventId);
        if (!event) return null;

        return buildTournamentBracket(
            event,
            relatedMatchPlans,
            matchPlans!,
            teams!,
            isFinal
        );
    }, [eventLoading, matchPlanLoading, matchResultLoading, teamLoading, events, relatedMatchPlans, matchPlans, teams, isFinal, eventId]);


    const [boxNodes, setBoxNodes] = useState<Record<number, TournamentNode>>({});

    // refを登録する関数
    const registerNode = useCallback((matchId: number, node: TournamentNode) => {
        setBoxNodes(prev => ({
            ...prev,
            [matchId]: node
        }));
    }, []);

    // ロード中ならスピナーを表示
    if (eventLoading || matchPlanLoading || teamLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // トーナメントのデータがなければこれ
    if (!tournamentData) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">このイベントにはトーナメントデータがありません</p>
            </div>
        );
    }

    // 与えられたトーナメント表の最大列数
    const maxRound = tournamentData.rounds;
    // / 最大行数
    // const maxRowNum = max(...tournamentData.matches.map(value => value.row))
    // if (maxRowNum == -Infinity) return <></>

    // 参加チームを取得
    // このトーナメントに関わるチームを取得
    const maxRowNum = tournamentData.teamIds.length * 2;

    // const processedRounds = Array.from({length: tournamentData.rounds})
    //     .map((_, roundIndex) => {
    //         const roundNumber = roundIndex + 1;
    //         const roundMatches = tournamentData.matches
    //             .filter(match => match.column === roundNumber)
    //             .sort((a, b) => a.row - b.row);
    //
    //         const roundMatchesWithSpace = Array.from(
    //             {length: maxRowNum},
    //             (_, index) => roundMatches.find(m => m.row - 1 === index)
    //         );
    //
    //         return {
    //             roundNumber,
    //             roundMatchesWithSpace
    //         };
    //     })


    let tournamentTeams: string[] = []
    // if (processedRounds[0]) {
    //
    //     tournamentTeams = processedRounds[0].roundMatchesWithSpace.filter(team => !!team && team.type === "match").flatMap(team => team?.tournamentMatchNode.teamIds)
    //     for (let i = 1; i < processedRounds.length; i++) {
    //         processedRounds[i].roundMatchesWithSpace
    //             .filter(node => !!node)
    //             .forEach((node) => {
    //                 if (node?.type !== "match") return
    //                 const premise = node?.tournamentMatchNode.premiseNode
    //                 if (!premise) return
    //                 const dependIdx = premise.findIndex(node => implementsTournamentNode(node))
    //                 if (dependIdx === -1 || dependIdx === undefined) return;
    //
    //                 const depend = premise[dependIdx] as TournamentNode // トーナメント内に依存しているノードを探しているのでstringは除外
    //                 const rawTeam = node.tournamentMatchNode.teamIds.filter(teamId => tournamentTeams.includes(teamId))
    //
    //                 if (depend && rawTeam.length > 0) {
    //                     if (dependIdx < premise.length / 2) { // 上半分が依存やつなら
    //                         //     下側に出る
    //                         const idx = tournamentTeams.findLastIndex(teamId => depend.type === "match" && depend.tournamentMatchNode.teamIds.includes(teamId))
    //                         if (idx) tournamentTeams.splice(idx + rawTeam.length, 0, ...rawTeam);
    //                     } else {
    //                         // 上側に出る
    //                         const idx = tournamentTeams.findIndex(teamId => depend.type === "match" && depend.tournamentMatchNode.teamIds.includes(teamId))
    //                         if (idx) tournamentTeams.splice(idx, 0, ...rawTeam)
    //
    //
    //                     }
    //                 }
    //             })
    //     }
    // }

    const tournamentTeamsWithSpace: (string | undefined)[] = [...tournamentTeams]
    // tournamentTeamsに余白を1行ずつ追加
    for (let i = 0; i < maxRowNum - 1; i++) {
        tournamentTeamsWithSpace.splice(i * 2 + 1, 0, undefined);
    }
    console.log("tournamentm", tournamentData.nodes)
    
    return (
        <div className="w-full overflow-x-auto">
            <div className="grid min-w-[250px] relative"
                 style={{
                     gridTemplateColumns: `repeat(${tournamentData.rounds}, ${rowWidth}px)`,
                     gridTemplateRows: `repeat(${maxRowNum}, ${rowHeight}px)`
                 }}
            >
                {
                    tournamentData.nodes.map(match => {
                        return <div 
                            key={"node-"+match.nodeId}
                            style={{
                                gridColumn: match.column,
                                gridRow: match.row
                            }}
                            >
                            {match.nodeId}
                            {match.type}
                        </div>
                            
                        
                    })
                }

                
                {/*{processedRounds.map(({roundNumber, roundMatchesWithSpace}) => {*/}
                {/*    return roundMatchesWithSpace.map(match => {*/}
                {/*        if (match?.type === "match") return <TournamentBoxWrapper*/}
                {/*            key={`${eventId}-match-${match.matchId}`}*/}
                {/*            isFinal={maxRound - 1 <= roundNumber}*/}
                {/*            roundNumber={roundNumber}*/}
                {/*            match={match}*/}
                {/*            boxStyle={{*/}
                {/*                gridColumn: roundNumber,*/}
                {/*                gridRow: match.row*/}
                {/*            }}*/}
                {/*            matchResult={matchResults && matchResults[match.matchId]}*/}
                {/*            boxNodes={boxNodes}*/}
                {/*            registerNode={registerNode}*/}
                {/*        />*/}
                {/*    })*/}
                {/*})}*/}

                {/*{*/}
                {/*    tournamentTeamsWithSpace.map((teamId, index) => {*/}
                {/*    // tournamentData.teamCards.map((teamId, index) => {*/}
                {/*        if (!teamId) return null;   */}
                {/*        return (*/}
                {/*            <div*/}
                {/*                key={"teambox-teambx-" + teamId.id+"-"+eventId}*/}
                {/*                className={"h-20 relative pl-14"}*/}
                {/*                style={{*/}
                {/*                    gridColumn: 1,*/}
                {/*                    gridRow: index+1*/}
                {/*                }}*/}

                {/*            >*/}
                {/*                <TournamentTeamBox*/}
                {/*                    isFinal={false}*/}
                {/*                    boxIndex={index * 2}*/}
                {/*                    boxLength={0}*/}
                {/*                    roundNumber={1}*/}

                {/*                    displayStr={getMatchDisplayStr(teamId.id)}*/}
                {/*                    isWon={false}*/}

                {/*                />*/}
                {/*            </div>*/}
                {/*        )*/}
                {/*    })*/}
                {/*}*/}

                {/*{*/}
                {/*    processedRounds.map(({roundNumber, roundMatchesWithSpace}) => {*/}
                {/*        // if (roundNumber === 1) return null;*/}
                {/*        return roundMatchesWithSpace.map(match => {*/}
                {/*            if (match?.type === "match") return (*/}
                {/*                <div*/}
                {/*                    key={"d-" + roundNumber + "-" + eventId + "-" + match.matchId}*/}
                {/*                    className={"h-20 relative  bg-red-400 w-24"}*/}
                {/*                    style={{*/}
                {/*                        gridColumn: roundNumber,*/}
                {/*                        gridRow: match.row * 2*/}
                {/*                    }}*/}
                {/*                >*/}
                {/*                    {match.tournamentMatchNode.teamIds}*/}
                {/*                </div>*/}
                {/*            )*/}
                {/*        })*/}
                {/*    })*/}
                {/*}*/}

            </div>
        </div>
    );
}

export default TournamentTable


const TournamentBoxWrapper = ({isFinal, roundNumber, match, boxStyle, matchResult, boxNodes, registerNode}: {
    isFinal: boolean,
    roundNumber: number,
    match: TournamentNode,
    boxStyle: CSSProperties,
    matchResult?: MatchResult,
    boxNodes: Record<number, TournamentNode>,
    registerNode: (matchId: number, node: TournamentNode) => void,

}) => {
    const {getMatchDisplayStr, getActualTeamIdByVariableId} = useData();

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
            return boxNodes[match.nodeId];
        }
        return null;
    }, [match.nextNode, boxNodes]);


    // このボックスのRefをコンテキストに登録
    useEffect(() => {
        if (match.nodeId && wrapperRef.current) {
            registerNode(match.nodeId, match)
        }
    }, [match, match.nodeId, registerNode]);
    // リサイズ時や初回レンダリング時に座標を再計算
    const calculateLineCoordinates = useCallback(() => {

        if (!matchBoxRef.current || !nextNode || !wrapperRef.current) return;
        const currentBoxRect = matchBoxRef.current.getBoundingClientRect();


        // 1行の高さ
        const rowHeight = 80;
        const rowWidth = 224;
        // const rowPaddingX = 56;
        const teamBoxHeight = 20;

        const currentRow = match.row;
        const nextRow = nextNode.row;
        const rowDiff = nextRow - currentRow;
        const currentRound = match.column;
        const nextRound = nextNode.column;
        const roundDiff = nextRound - currentRound;

        const nextNodeTargetRowIndex = nextNode.type === "team" ? undefined : nextNode.tournamentMatchNode.premiseNode?.findIndex(nextNodePremise => {
            if (match.type === "match") { // 問題が起こったらあやしいところ
                if (implementsTournamentNode(nextNodePremise)) {
                    return nextNodePremise.type === "match" && (nextNodePremise.matchId === match.matchId);
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
    }, [nextNode, match, ]);

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
        }, [nextNode, match, calculateLineCoordinates]
    );

    return (
        <div
            className={"h-20 relative pl-14"}
            style={boxStyle}
            ref={wrapperRef}
        >
            {match.type==="match" && match.matchId && (
                <div className="text-md text-gray-500 mb-1 absolute translate-y-[-100%]">
                    <p>{match.tournamentMatchNode.matchPlan.matchName} {`#${match.matchId}`} @{match.row}a
                        {nextNode && nextNode.type === "match" && nextNode.matchId}
                        {match.tournamentMatchNode.matchPlan.matchNote && (
                            <span
                                className="ml-2 text-gray-400">{match.tournamentMatchNode.matchPlan.matchNote}</span>
                        )}
                    </p>
                </div>
            )}

            <div className="border border-gray-200  rounded relative shadow-sm " ref={matchBoxRef}>
                {match.type === "match" && match.tournamentMatchNode.premiseNode?.map((child, idx) => {
                    let processedTeamId: string | number | null = getActualTeamIdByVariableId(match.tournamentMatchNode.teamIds[idx])
                    if (!processedTeamId) processedTeamId = match.tournamentMatchNode.teamIds[idx].toString()
                    return (
                        <Fragment key={`team-${idx}-${match.matchId}-frag-${match.matchId}`}>
                            <TournamentTeamBox key={`team-${idx}-${match.matchId}`}
                                               isFinal={isFinal}
                                               displayStr={getMatchDisplayStr(match.tournamentMatchNode.teamIds[idx])}
                                               boxLength={match.tournamentMatchNode.teamIds.length}
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

const TournamentTeamBox = ({isFinal, displayStr, boxLength, boxIndex, roundNumber, isWon}: {
    isFinal: boolean,
    displayStr: string,
    boxLength: number,
    boxIndex: number,
    roundNumber: number,
    isWon: boolean,
}) => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [lineData, setlineData] = useState({
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

                const startX = box.width;
                const endX = box.width + 12;
                let startY = 0;
                let endY = 0;
                let type = "H" as "H" | "V" | "LT" | "RT" | "LB" | "RB";

                const isUpperHalf = boxIndex < boxLength / 2; // そのチーム名表示場所が上半分か下半分かを判定
                if (isUpperHalf) {
                    startY = box.height / 2 - 2;
                    endY = box.height;
                    type = "RT";
                } else {
                    // startY = 0;
                    endY = box.height / 2 + 2;
                    type = "RB";
                }

                setlineData({startX, startY, endX, endY, type});
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

    }, [boxIndex, boxLength]);
    return (
        <div
            className={`flex justify-between items-center p-2 relative h-10 border border-gray-300 rounded shadow-sm ${isWon ? "bg-red-100" : "bg-white"}`}
            ref={boxRef}
        >
            <span className="truncate max-w-[180px]">{displayStr}</span>
            {
                !isFinal &&
                <TournamentLine startX={lineData.startX}
                                startY={lineData.startY}
                                endX={lineData.endX}
                                endY={lineData.endY}
                                type={lineData.type}
                                color={isWon ? "rgb(255,0,0)" : "rgba(156, 163, 175, 1)"}
                                thickness={4}
                                duration={200}
                                timeout={(roundNumber - 1) * 1000}
                />
            }

        </div>
    )
}