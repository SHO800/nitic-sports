"use client"

import {useData} from "@/hooks/data";
import React, {useEffect, useRef, useMemo, useState, memo} from "react";
import {MatchPlan} from "@prisma/client";
import LeagueTableRow from "@/components/common/leagueTable/LeagueTableRow";

const VirtualizedLeagueTable = ({i_key, eventId, blockName, block}: {
    i_key: string,
    eventId: number,
    blockName: string,
    block: {
        teamId: string
        rank?: number
    }[]
}) => {
    const {getBlockMatches} = useData();
    
    // コンテナ参照と仮想化スクロール用の状態
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
    const [isVisible, setIsVisible] = useState(false);

    // チームIDリストをメモ化
    const teamIds = useMemo(() => block.map((team) => team.teamId), [block]);
    const [referredMatches, setReferredMatches] = useState<MatchPlan[]>([]);

    // インデックス配列をメモ化
    const teamIdsLengthArray = useMemo(() => 
        [-1, ...[...Array(teamIds.length).keys()]], 
        [teamIds.length]
    );

    const tableRef = useRef<HTMLTableElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    
    // 交差オブザーバーを設定 - テーブルが表示された時のみレンダリングする
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.1 });
        
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        
        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);
    
    // テーブルサイズ変更監視をメモ化された関数で処理
    const updateDiagonalLine = useMemo(() => {
        return () => {
            if (tableRef.current && lineRef.current) {
                const rect = tableRef.current.getBoundingClientRect();
                const width = rect.width * teamIds.length / (teamIds.length + 1);
                const height = rect.height * teamIds.length / (teamIds.length + 1);

                lineRef.current.style.width = `${Math.pow((Math.pow(width, 2) + Math.pow(height, 2)), 0.5)}px`;
                lineRef.current.style.rotate = `${Math.atan2(height - 1, width) * 180 / Math.PI}deg`;
            }
        };
    }, [teamIds.length]);
    
    useEffect(() => {
        const resizeObserver = new ResizeObserver(updateDiagonalLine);

        if (tableRef.current && isVisible) {
            resizeObserver.observe(tableRef.current);
            // 初期サイズを設定
            updateDiagonalLine();
        }

        return () => {
            if (tableRef.current) {
                resizeObserver.unobserve(tableRef.current);
            }
        };
    }, [updateDiagonalLine, isVisible]);
    
    // ブロック内の試合データを取得 - ビジブルになった時のみ
    useEffect(() => {
        if (isVisible) {
            const matches = getBlockMatches(eventId, blockName, block);
            setReferredMatches(matches);
        }
    }, [eventId, blockName, block, getBlockMatches, isVisible]);

    // スクロール処理
    const handleScroll = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            const scrollTop = container.scrollTop;
            const height = container.clientHeight;
            
            // 画面に表示される行の範囲を計算
            const rowHeight = 40; // 行の高さ（ピクセル）
            const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
            const endIndex = Math.min(
                teamIdsLengthArray.length - 1,
                Math.ceil((scrollTop + height) / rowHeight) + 2
            );
            
            setVisibleRange({ start: startIndex, end: endIndex });
        }
    };
    
    // スクロールイベントの設定
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            // 初期表示範囲を設定
            handleScroll();
        }
        
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [teamIdsLengthArray.length]);

    // 表示する行を計算
    const visibleRows = useMemo(() => {
        if (!isVisible || referredMatches.length === 0) return [];
        
        // 必要な行だけを生成
        return teamIdsLengthArray
            .slice(visibleRange.start, visibleRange.end + 1)
            .map((i) => ({
                index: i,
                top: i * 40, // 行の高さ
                content: (
                    <LeagueTableRow 
                        key={"leagueTableTr" + i_key + "-" + i} 
                        i_key={i_key}
                        row={i}
                        teamIdsLengthArray={teamIdsLengthArray}
                        blockName={blockName}
                        block={block}
                        referredMatches={referredMatches}
                    />
                )
            }));
    }, [teamIdsLengthArray, visibleRange, i_key, blockName, block, referredMatches, isVisible]);

    // 全体の高さ
    const totalHeight = teamIdsLengthArray.length * 40; // 行の高さ

    return (
        <div ref={containerRef} className="relative max-h-[70vh] overflow-auto">
            <div className={"relative"} style={{ height: `${totalHeight}px` }}>
                <div className={"h-[1px] bg-slate-300 absolute bottom-0 right-0 origin-bottom-right"} ref={lineRef}/>
                <table className={"border-collapse border border-slate-500 w-full"} ref={tableRef}>
                    <tbody>
                        {visibleRows.map(row => (
                            <React.Fragment key={`row-${row.index}`}>
                                {row.content}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default memo(VirtualizedLeagueTable);
