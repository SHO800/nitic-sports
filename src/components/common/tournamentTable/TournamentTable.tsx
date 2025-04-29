import {MatchPlan} from "@prisma/client";
import React, {useMemo} from "react";
import {buildTournamentBracket, TournamentData} from "@/utils/tournamentUtils";
import {useData} from "@/hooks/data";
import TournamentTeamBox from "@/components/common/tournamentTable/TournamentTeamBox";
import TournamentMatchBox from "@/components/common/tournamentTable/TournamentMatchBox";


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

    const firstRowWidth = 70;
    const rowWidth = 60;
    const rowHeight = 30;

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
    const maxRowNum = tournamentData.teamIds.length * 2;


    return (
        <div className="w-full overflow-x-auto">
            <div className="grid min-w-[250px] relative"
                 style={{
                     gridTemplateColumns: `${firstRowWidth}px repeat(${tournamentData.rounds}, ${rowWidth}px)`,
                     gridTemplateRows: `repeat(${maxRowNum}, ${rowHeight}px)`
                 }}
            >
                {
                    tournamentData.nodes.map(match => {
                        return <div
                            key={"node-" + match.nodeId}
                            style={{
                                gridColumn: match.column,
                                gridRow: match.row
                            }}
                        >

                            {
                                match.type === "team" &&
                                <TournamentTeamBox node={match} rowWidth={rowWidth} rowHeight={rowHeight}/>
                            }
                            {match.type === "match" && <TournamentMatchBox match={match} boxStyle={{}}
                                                                           matchResult={matchResults && matchResults[match.matchId.toString()]}
                                                                           rowWidth={rowWidth} rowHeight={rowHeight}/>
                            }

                        </div>


                    })
                }


                {/*{processedRounds.map(({roundNumber, roundMatchesWithSpace}) => {*/}
                {/*    return roundMatchesWithSpace.map(match => {*/}
                {/*        if (match?.type === "match") return <TournamentMatchBox*/}
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
