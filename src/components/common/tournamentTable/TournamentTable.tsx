import {MatchPlan} from "@prisma/client";
import React, {ReactNode, useMemo} from "react";
import {buildTournamentBracket, TournamentData} from "@/utils/tournamentUtils";
import {useData} from "@/hooks/data";
import TournamentTeamBox from "@/components/common/tournamentTable/TournamentTeamBox";
import TournamentMatchBox from "@/components/common/tournamentTable/TournamentMatchBox";
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";


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

    const maxRowNum = tournamentData.teamIds.length * 2;


    return (
        <div className="w-full overflow-x-auto">
            <div className="grid min-w-[250px] relative"
                 style={{
                     gridTemplateColumns: `${firstRowWidth}px repeat(${tournamentData.rounds + 2}, ${rowWidth}px)`,
                     gridTemplateRows: `repeat(${maxRowNum}, ${rowHeight}px)`
                 }}
            >
                {tournamentData.nodes.map(match => {
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
                        {
                            match.type === "match" &&
                            <TournamentMatchBox match={match} boxStyle={{}}
                                                matchResult={matchResults && matchResults[match.matchId.toString()]}
                                                rowWidth={rowWidth}
                                                rowHeight={rowHeight}/>
                        }

                    </div>
                })}

                {
                    tournamentData.nodes.filter(node => !node.nextNode).map(lastNode => {
                        if (lastNode.type === "team") return null;
                        let text = "優勝";
                        if (lastNode.tournamentMatchNode.teamIds.some(value => {
                            const ati = analyzeVariableTeamId(value)
                            if (!ati || ati.type === "L") return false;
                            return ati.condition === "L";
                        })) { // 戦うチームにどこかの試合の敗者という条件が含まれていたら 3位決定戦であったものとと扱う.
                            text = "3位"
                        }
                        return (
                            <SpecialNode key={eventId + "-specialNode-"+lastNode.nodeId} column={lastNode.column+2} row={lastNode.row}>
                            {text}
                        </SpecialNode>
                        )

                    })
                }

            </div>
        </div>
    );
}

export default TournamentTable

const SpecialNode = ({children, column, row}: { children: ReactNode, column: number, row: number }) => {
    return (
        <div
            className={" text-center"}
            style={{
                gridColumn: column,
                gridRow: row
            }}>
            {children}
        </div>
    )

}