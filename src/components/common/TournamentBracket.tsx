import React, {useMemo} from 'react';
import {useData} from '@/hooks/data';
import {buildTournamentBracket, TournamentData} from '@/utils/tournamentUtils';
import {MatchPlan} from "@prisma/client";
import TournamentBoxWrapper from "@/components/common/TournamentBoxWrapper";
import {max} from "@floating-ui/utils";

interface TournamentBracketProps {
    eventId: number;
    isFinal: boolean;
    relatedMatchPlans: MatchPlan[];
}

export default function TournamentBracket({eventId, isFinal, relatedMatchPlans}: Readonly<TournamentBracketProps>) {
    const {
        events,
        eventLoading,
        matchPlanLoading,
        matchPlans,
        matchResultLoading,
        teams,
        teamLoading,
    } = useData();

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
    
    if (eventLoading || matchPlanLoading || teamLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!tournamentData) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">このイベントにはトーナメントデータがありません</p>
            </div>
        );
    }
    
    const maxRowNum = max(...tournamentData.matches.map(value => value.row))
    if (maxRowNum == Infinity) return <></>
    
    
    
    return (
        <div className="w-full overflow-x-auto">
            {/*<div className="flex flex-row min-w-max pb-8">*/}
            <div className="grid  min-w-[250px]  relative"
                 style={{
                     gridTemplateColumns: `repeat(${tournamentData.rounds}, 224px)`,
                     gridTemplateRows: `repeat(${maxRowNum}, 80px)`
                 }}
            >
                {Array.from({length: tournamentData.rounds}).map((_, roundIndex) => {
                    const roundNumber = roundIndex + 1;
                    const roundMatches = tournamentData.matches
                        .filter(match => match.round === roundNumber)
                        .sort((a, b) => a.position - b.position);
                    const roundMatchesWithSpace = Array.from({length: maxRowNum}, (_,  index) => roundMatches.find(m => m.row -1 === index))

                    return roundMatchesWithSpace.map(match => {
                        if (match) return <TournamentBoxWrapper key={`${eventId}-match-${match.matchId}`}
                                                                roundNumber={roundNumber} match={match}
                                                                boxStyle={{
                                                                    gridColumn: roundNumber,
                                                                    gridRow: match.row
                                                                }}
                        />
                        else null
                    })
                        // <div
                        //     key={eventId+"-round-" + roundIndex}
                        //     className="flex flex-col min-w-[250px] mr-12 relative"
                        //     style={{}}
                        // >
                            {/*<div className="flex flex-col space-y-2">*/}
                            {/*    {roundMatchesWithSpace.map(match => {*/}
                            {/*        if (match) return <TournamentBoxWrapper key={`${eventId}-match-${match.matchId}`}*/}
                            {/*                              roundNumber={roundNumber} match={match}/>*/}
                            {/*        else return <div className={"h-20"} ></div>*/}
                            {/*    })}*/}
                            {/*</div>*/}
                    
                            
                    
                        // </div>
                })}
            </div>
        </div>
    );
}