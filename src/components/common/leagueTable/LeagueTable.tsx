"use client";

import LeagueTableCell from "@/components/common/leagueTable/LeagueTableCell";
import { useDataContext } from "@/contexts/dataContext";
import type { MatchPlan } from "@prisma/client";
import { memo, useEffect, useRef, useState } from "react";

const LeagueTable = ({
                         i_key,
                         eventId,
                         blockName,
                         block,
                         receivedTeamIds,
                     }: {
    i_key: string;
    eventId: number;
    blockName: string;
    block: {
        teamId: string;
        rank?: number;
    }[];
    receivedTeamIds?: string[];
}) => {
    const { getBlockMatches } = useDataContext();

    const teamIds = block.map((team) => team.teamId);
    const [referredMatches, setReferredMatches] = useState<MatchPlan[]>([]);

    // チーム数+1の配列を作成（-1はヘッダー用）
    const teamIdsLengthArray = [-1, ...[...Array(teamIds.length).keys()]];

    const tableRef = useRef<HTMLTableElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    // 対角線のサイズを調整するためのリサイズ監視
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (tableRef.current) {
                const rect = tableRef.current.getBoundingClientRect();
                const width = (rect.width * teamIds.length) / (teamIds.length + 1);
                const height = (rect.height * teamIds.length) / (teamIds.length + 1);

                if (lineRef.current) {
                    lineRef.current.style.width = `${(width ** 2 + height ** 2) ** 0.5}px`;
                    lineRef.current.style.rotate = `${(Math.atan2(height - 1, width) * 180) / Math.PI}deg`;
                }
            }
        });

        if (tableRef.current) {
            resizeObserver.observe(tableRef.current);
        }

        return () => {
            if (tableRef.current) {
                resizeObserver.unobserve(tableRef.current);
            }
        };
    }, [teamIds.length]);

    // ブロックに関連する試合を取得
    useEffect(() => {
        const matches = getBlockMatches(eventId, blockName, block);
        setReferredMatches(matches);
    }, [eventId, blockName, block, getBlockMatches]);

    return (
        <div className="relative">
            <div
                className="h-[1px] bg-slate-300 absolute bottom-0 right-0 origin-bottom-right"
                ref={lineRef}
            />
            <table
                className="border-collapse border border-slate-500 w-full h-full"
                ref={tableRef}
            >
                <tbody>
                {teamIdsLengthArray.map((i) => (
                    <tr
                        key={`leagueTableTr${i_key}-${i}`}
                        className="border border-slate-300"
                    >
                        {teamIdsLengthArray.map((j) => (
                            <td
                                key={`leagueTableTd${i_key}-${j}`}
                                className="border border-slate-300 h-8 w-16 text-center"
                            >
                                <LeagueTableCell
                                    i_key={i_key}
                                    row={i}
                                    col={j}
                                    blockName={blockName}
                                    block={block}
                                    referredMatches={referredMatches}
                                    teamIds={receivedTeamIds}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default memo(LeagueTable);