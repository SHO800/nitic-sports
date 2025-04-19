import React, {useMemo} from 'react';
import {useData} from '@/hooks/data';
import {buildTournamentBracket, TournamentData} from '@/utils/tournamentUtils';
import {MatchPlan} from "@prisma/client";
import TournamentBoxWrapper from "@/components/common/TournamentBoxWrapper";

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

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex flex-row min-w-max pb-8">
                {Array.from({length: tournamentData.rounds}).map((_, roundIndex) => {
                    const roundNumber = roundIndex + 1;
                    const roundMatches = tournamentData.matches
                        .filter(match => match.round === roundNumber)
                        .sort((a, b) => a.position - b.position);

                    return (
                        <div
                            key={`round-${roundIndex}`}
                            className="flex flex-col min-w-[250px] mr-12 relative"
                            style={{
                                marginTop: roundNumber > 1 ? `${Math.pow(2, roundNumber - 2) * 3}rem` : '0'
                            }}
                        >
                            <div className="flex flex-col space-y-8">
                                {roundMatches.map(match => (
                                    <TournamentBoxWrapper key={`${eventId}-match-${match.matchId}`}
                                                          roundNumber={roundNumber} match={match}/>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}