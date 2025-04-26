import React, {useMemo, useEffect} from 'react';
import {useData} from '@/hooks/data';
import {buildTournamentBracket, TournamentData} from '@/utils/tournamentUtils';
import {MatchPlan, MatchResult} from "@prisma/client";
import TournamentBoxWrapper from "@/components/common/TournamentBoxWrapper";
import {max} from "@floating-ui/utils";
import {processRoundMatches} from "@/utils/tournamentBracketUtils";
import {TournamentBracketProvider, useTournamentBracket} from '@/contexts/TournamentBracketContext';

interface TournamentBracketProps {
    eventId: number;
    isFinal: boolean;
    relatedMatchPlans: MatchPlan[];
}

// 内部コンポーネント：TournamentBracketProviderの中で使用
function TournamentBracketContent({
    eventId,
    tournamentData,
    maxRound,
    maxRowNum,
    processedRounds,
    matchResults
}: {
    eventId: number;
    tournamentData: TournamentData;
    maxRound: number,
    maxRowNum: number;
    processedRounds: ReturnType<typeof processRoundMatches>;
    matchResults?: Record<string, MatchResult>;
}) {

    
    return (
        <div className="w-full overflow-x-auto">
            <div className="grid min-w-[250px] relative"
                 style={{
                     gridTemplateColumns: `repeat(${tournamentData.rounds}, 224px)`,
                     gridTemplateRows: `repeat(${maxRowNum}, 80px)`
                 }}
            >
                {processedRounds.map(({ roundNumber, roundMatchesWithSpace }) => {
                    return roundMatchesWithSpace.map(match => {
                        if (match) return <TournamentBoxWrapper key={`${eventId}-match-${match.matchId}`}
                                                                isFinal={maxRound-1 <= roundNumber}
                                                                roundNumber={roundNumber} 
                                                                match={match}
                                                                boxStyle={{
                                                                    gridColumn: roundNumber,
                                                                    gridRow: match.row
                                                                }}
                                                                matchResult={matchResults && matchResults[match.matchId]}
                        />
                    })
                })}
            </div>
        </div>
    );
}

// メインコンポーネント
export default function TournamentBracket({eventId, isFinal, relatedMatchPlans}: Readonly<TournamentBracketProps>) {
    const {
        events,
        eventLoading,
        matchPlanLoading,
        matchPlans,
        matchResultLoading,
        matchResults,
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
    const maxRound = tournamentData.rounds;
    const maxRowNum = max(...tournamentData.matches.map(value => value.row))
    if (maxRowNum == Infinity) return <></>
    
    // 切り分けたユーティリティ関数を使用
    // 空白列も追加
    const processedRounds = [...processRoundMatches(tournamentData, maxRowNum), {roundNumber: 6, roundMatchesWithSpace: Array.from({length: maxRowNum})}];
    
    return (
        <TournamentBracketProvider>
            <TournamentBracketContent
                eventId={eventId}
                tournamentData={tournamentData}
                maxRound={maxRound}
                maxRowNum={maxRowNum}
                processedRounds={processedRounds}
                matchResults={matchResults}
            />
        </TournamentBracketProvider>
    );
}