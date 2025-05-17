"use client"

import {useData} from "@/hooks/data";
import React, {useEffect, useRef, useMemo, useState, memo, useCallback} from "react";
import {MatchPlan} from "@prisma/client";
import LeagueTableCell from "@/components/common/leagueTable/LeagueTableCell";
import VirtualizedLeagueTable from "@/components/common/leagueTable/LeagueTableVirtualized";
import LeagueTableEntity from "@/components/common/leagueTable/LeagueTableEntity";

// チームの数に基づいて仮想化を使用するかを決定する閾値
const VIRTUALIZATION_THRESHOLD = 8;

const LeagueTable = ({i_key, eventId,  blockName, block}: {
    i_key: string,
    eventId: number,
    blockName: string,
    block: {
        teamId: string
        rank?: number
    }[]
}) => {
    // チームの数が閾値を超える場合は仮想化テーブルを使用
    if (block.length > VIRTUALIZATION_THRESHOLD) {
        return (
            <VirtualizedLeagueTable
                i_key={i_key}
                eventId={eventId}
                blockName={blockName}
                block={block}
            />
        );
    }else {
        return (
            <LeagueTableEntity
                i_key={i_key}
                eventId={eventId}
                blockName={blockName}
                block={block}
            />
        );
    }
    
};


export default memo(LeagueTable);
