"use client";

import {useCallback, useEffect, useState, useMemo} from 'react';
import LeagueTable from '@/components/common/leagueTable/LeagueTable';
import {MatchPlan} from "@prisma/client";
import TournamentTable from "@/components/common/tournamentTable/TournamentTable";
import {useData} from '@/hooks/data';

const Bracket = ({eventId, matchPlans}: { eventId: number, matchPlans: MatchPlan[] }) => {
    const [isFinal, setIsFinal] = useState(false);
    const {
        events,
        eventLoading
    } = useData();

    const [hasPreliminary, setHasPreliminary] = useState(false);
    const [hasFinal, setHasFinal] = useState(false);
    const [eventName, setEventName] = useState('');
    const [preliminaryType, setPreliminaryType] = useState<'tournament' | 'league' | null>(null);
    const [finalType, setFinalType] = useState<'tournament' | 'league' | null>(null);
    const [relatedMatchPlans, setRelatedMatchPlans] = useState<MatchPlan[]>([]);
    
    // 現在選択されている大会の形式を取得
    const getCurrentType = useCallback(() => {
        return isFinal ? finalType : preliminaryType;
    }, [isFinal, finalType, preliminaryType]);

    // 現在のイベントをメモ化
    const currentEvent = useMemo(() => {
        if (!events) return null;
        return events.find(e => e.id === eventId) || null;
    }, [events, eventId]);

    // チームデータを取得 - メモ化利用
    const teamData = useMemo(() => {
        if (!currentEvent) return null;

        const teamData = currentEvent.teamData as unknown as TeamData[];
        if (!Array.isArray(teamData) || teamData.length === 0) return null;

        return isFinal && teamData.length > 1 ? teamData[1] : teamData[0];
    }, [currentEvent, isFinal]);

    const currentType = getCurrentType();

    useEffect(() => {
        if (!eventLoading && currentEvent) {
            setEventName(currentEvent.name);

            // 予選/本選の形式（トーナメントまたはリーグ）を確認
            const teamData = currentEvent.teamData as unknown as TeamData[];

            if (Array.isArray(teamData) && teamData.length > 0) {
                setHasPreliminary(true);
                setPreliminaryType(teamData[0]?.type as 'tournament' | 'league' | null);
            } else {
                setHasPreliminary(false);
                setPreliminaryType(null);
            }

            if (Array.isArray(teamData) && teamData.length > 1) {
                setHasFinal(true);
                setFinalType(teamData[1]?.type as 'tournament' | 'league' | null);
            } else {
                setHasFinal(false);
                setFinalType(null);
            }
        }
    }, [currentEvent, eventLoading]);

    // matchPlansのフィルタリングをメモ化
    useEffect(() => {
        if (teamData && teamData.type === "tournament" && teamData.matchPlanIdRange) {
            const matchPlanIdRange = teamData.matchPlanIdRange;
            const startId = matchPlanIdRange.start;
            const endId = matchPlanIdRange.end;
            const additionalIds = matchPlanIdRange.additional || [];

            // 試合プランのID範囲を使用して関連する試合プランをフィルタリング
            const filteredMatchPlans = matchPlans.filter(matchPlan => {
                return (matchPlan.id >= startId && matchPlan.id <= endId) || additionalIds.indexOf(matchPlan.id) >= 0;
            });
            setRelatedMatchPlans(filteredMatchPlans);
        }
    }, [teamData, matchPlans]);

    if (eventLoading || !eventId) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">{eventName} - 対戦表</h1>

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
                                {hasFinal ? "予選" : "本選"} ({preliminaryType === 'tournament' ? 'トーナメント' : 'リーグ'})
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
                                本選 ({finalType === 'tournament' ? 'トーナメント' : 'リーグ'})
                            </button>
                        )}
                    </div>
                </div>
            )}

            {(hasPreliminary || hasFinal) ? (
                <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">

                    {currentType === 'tournament' && (
                        <TournamentTable
                            key={`bracket-tournament-${eventId}-${isFinal}`}
                            eventId={eventId}
                            isFinal={isFinal}
                            relatedMatchPlans={relatedMatchPlans}
                        />
                    )}

                    {currentType === 'league' && teamData?.type === "league" && teamData.blocks && (
                        <div className="space-y-8">
                            {Object.keys(teamData.blocks).map((blockName) => (
                                <div key={`league-${eventId}-${blockName}`} className="mb-6">
                                    <h3 className="text-xl font-semibold mb-4">{blockName}ブロック</h3>
                                    <LeagueTable
                                        key={`league-table-${eventId}-${blockName}`}
                                        i_key={`bracket-league-${eventId}-${blockName}`}
                                        eventId={eventId}
                                        blockName={blockName}
                                        block={teamData.blocks[blockName]}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500">この種目には対戦表データがありません。</p>
                </div>
            )}
        </div>
    );
}

export default Bracket;
