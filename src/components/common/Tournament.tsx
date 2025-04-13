"use client";

import { useState, useEffect } from 'react';
import TournamentBracket from '@/components/common/TournamentBracket';
import { useData } from '@/hooks/data';
import { TeamData } from '@/utils/tournamentUtils';
import { MatchPlan } from "@prisma/client";

const Tournament = ({eventId, matchPlans}: {eventId: number, matchPlans: MatchPlan[]}) => {

    const [isFinal, setIsFinal] = useState(false);
    const { events, eventLoading } = useData();

    const [hasPreliminary, setHasPreliminary] = useState(false);
    const [hasFinal, setHasFinal] = useState(false);
    const [eventName, setEventName] = useState('');

    useEffect(() => {
        if (!eventLoading && events && eventId) {
            const event = events.find(e => e.id === eventId);

            if (event) {
                setEventName(event.name);

                // 予選/本選のトーナメントがあるか確認
                const teamData = event.teamData as unknown as TeamData[];
                setHasPreliminary(
                    Array.isArray(teamData) &&
                    teamData.length > 0 &&
                    teamData[0]?.type === 'tournament'
                );

                setHasFinal(
                    Array.isArray(teamData) &&
                    teamData.length > 1 &&
                    teamData[1]?.type === 'tournament'
                );
            }
        }
    }, [events, eventLoading, eventId]);

    if (eventLoading || !eventId) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">{eventName} - トーナメント表</h1>

            {(hasPreliminary || hasFinal) && (
                <div className="mb-8">
                    <div className="flex space-x-4">
                        {hasPreliminary && (
                            <button
                                className={`px-6 py-2 rounded-lg transition-colors ${
                                    !isFinal
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => setIsFinal(false)}
                            >
                                予選
                            </button>
                        )}
                        {hasFinal && (
                            <button
                                className={`px-6 py-2 rounded-lg transition-colors ${
                                    isFinal
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => setIsFinal(true)}
                            >
                                本選
                            </button>
                        )}
                    </div>
                </div>
            )}

            {(hasPreliminary || hasFinal) ? (
                <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
                    <TournamentBracket
                        eventId={eventId}
                        isFinal={isFinal}
                        relatedMatchPlans={matchPlans}
                    />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500">この種目にはトーナメント形式のデータがありません。</p>
                </div>
            )}
        </div>
    );
}

export default Tournament;