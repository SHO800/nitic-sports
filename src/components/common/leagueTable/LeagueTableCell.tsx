import {useData} from "@/hooks/data";
import {MatchPlan} from "@prisma/client";
import React, {useMemo} from "react";

const LeagueTableCell = ({i_key, row, col, blockName, block, referredMatches}: {
    i_key: string,
    row: number,
    col: number,
    blockName: string,
    block: { teamId: string }[],
    referredMatches: MatchPlan[]
}) => {
    const {getMatchDisplayStr, matchResults} = useData();

    // 基本的なセル内容の条件判定をメモ化
    const cellContent = useMemo(() => {
        if (referredMatches.length === 0) return null;
        if (row === -1 && col === -1) return <p key={i_key} className={"font-bold"}>{blockName}</p>;
        if (row === -1 && col > -1) return <p key={i_key} className={""}>{getMatchDisplayStr(block[col]?.teamId)}</p>;
        if (col === -1 && row > -1) return <p key={i_key} className={"text-sm"}>{getMatchDisplayStr(block[row]?.teamId)}</p>;
        if (row === col) return null;

        const leftSideTeam = block[row]?.teamId;
        const rightSideTeam = block[col]?.teamId;
        const match = referredMatches.find((match) => {
            return match.teamIds.includes(leftSideTeam) && match.teamIds.includes(rightSideTeam);
        });
        if (!match) return null;

        const matchStr = match.matchName ? match.matchName : match.matchNote ? match.matchNote : "";
        
        // 試合状態に応じた表示を返す
        switch (match.status) {
            case "Waiting":
            case "Preparing":
                return (
                    <div key={i_key} className={"text-sm p-2 "}>
                        <p className={"text-sm"}>({matchStr})</p>
                    </div>
                );
            case "Playing":
                return (
                    <div key={i_key} className={"text-sm p-2 bg-[rgba(200,255,200,.3)] arrow-flowing-bg"}>
                        <p className={"text-sm"}>({matchStr})</p>
                    </div>
                );
            case "Finished":
                return (
                    <div key={i_key} className={"text-sm p-2 animate-pulse"}>
                        <p className={"text-sm"}>({matchStr})</p>
                    </div>
                );
            case "Completed":
                // statusがCompletedの時はmatchResultsが存在する
                const matchResult = matchResults?.[match.id];
                if (!matchResult) return null;
                
                const leftSideTeamIndex = match.teamIds.indexOf(leftSideTeam);
                const rightSideTeamIndex = match.teamIds.indexOf(rightSideTeam);
                if (leftSideTeamIndex === -1 || rightSideTeamIndex === -1) return null;
                const leftSideTeamScore = matchResult.matchScores[leftSideTeamIndex];
                const rightSideTeamScore = matchResult.matchScores[rightSideTeamIndex];
                const scoreStr = `${leftSideTeamScore} - ${rightSideTeamScore}`;
                
                return (
                    <div key={i_key} className={"text-sm p-2 "}>
                        <p className={"text-sm"}>{scoreStr}</p>
                    </div>
                );
            default:
                return (
                    <div key={i_key} className={"text-sm p-2"}>
                        <p className={""}>{matchStr}</p>
                    </div>
                );
        }
    }, [blockName, block, col, getMatchDisplayStr, i_key, matchResults, referredMatches, row]);

    return cellContent;
};

export default React.memo(LeagueTableCell);
