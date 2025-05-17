"use client"

import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {MatchPlan} from "@prisma/client";
import {useDataContext} from "@/contexts/dataContext";
import LeagueTableRow from "@/components/common/leagueTable/LeagueTableRow";


const LeagueTable = ({i_key, eventId, blockName, block}: {
    i_key: string,
    eventId: number,
    blockName: string,
    block: {
        teamId: string
        rank?: number
    }[]
}) => {

    const {getBlockMatches} = useDataContext()

    // チームIDリストをメモ化
    const teamIds = useMemo(() => block.map((team) => team.teamId), [block]);
    const [referredMatches, setReferredMatches] = useState<MatchPlan[]>([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // インデックス配列をメモ化
    const teamIdsLengthArray = useMemo(() =>
            [-1, ...[...Array(teamIds.length).keys()]],
        [teamIds.length]
    );

    const tableRef = useRef<HTMLTableElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    // テーブルサイズ変更監視をメモ化された関数で処理
    const updateDiagonalLine = useCallback(() => {
        if (tableRef.current && lineRef.current) {
            const rect = tableRef.current.getBoundingClientRect();
            const width = rect.width * teamIds.length / (teamIds.length + 1);
            const height = rect.height * teamIds.length / (teamIds.length + 1);

            lineRef.current.style.width = `${Math.pow((Math.pow(width, 2) + Math.pow(height, 2)), 0.5)}px`;
            lineRef.current.style.rotate = `${Math.atan2(height - 1, width) * 180 / Math.PI}deg`;
        }
    }, [teamIds.length]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(updateDiagonalLine);

        if (tableRef.current) {
            resizeObserver.observe(tableRef.current);
            // 初期サイズを設定
            updateDiagonalLine();
        }

        return () => {
            if (tableRef.current) {
                resizeObserver.unobserve(tableRef.current);
            }
        };
    }, [updateDiagonalLine]);

    // ブロック内の試合データを取得
    useEffect(() => {
        let isMounted = true;

        // データ取得を少し遅延させることで、タブ切り替え時のパフォーマンスを向上
        const timer = setTimeout(() => {
            if (isMounted) {
                const matches = getBlockMatches(eventId, blockName, block);
                setReferredMatches(matches);
                setIsDataLoaded(true);
            }
        }, 10); // わずかな遅延

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [eventId, blockName, block, getBlockMatches]);

    // 行のレンダリングをメモ化
    const renderRows = useMemo(() => {
        if (!isDataLoaded) return null;

        return teamIdsLengthArray.map((i) => (
            <LeagueTableRow
                key={"leagueTableTr" + i_key + "-" + i}
                i_key={i_key}
                row={i}
                teamIdsLengthArray={teamIdsLengthArray}
                blockName={blockName}
                block={block}
                referredMatches={referredMatches}
            />
        ));
    }, [teamIdsLengthArray, i_key, blockName, block, referredMatches, isDataLoaded]);

    return (
        <div className={"relative"}>
            <div className={"h-[1px] bg-slate-300 absolute bottom-0 right-0 origin-bottom-right"} ref={lineRef}/>
            <table className={"border-collapse border border-slate-500 w-full h-full"} ref={tableRef}>
                <tbody>
                {renderRows}
                </tbody>
            </table>
        </div>
    );

};


export default memo(LeagueTable);
