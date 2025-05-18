import {useDataContext} from "@/contexts/dataContext";
import type {MatchPlan} from "@prisma/client";
import {memo} from "react";

const LeagueTableCell = ({
                             i_key,
                             row,
                             col,
                             blockName,
                             block,
                             referredMatches,
                             teamIds,
                         }: {
    i_key: string;
    row: number;
    col: number;
    blockName: string;
    block: { teamId: string; rank?: number }[];
    referredMatches: MatchPlan[];
    teamIds?: string[];
}) => {
    const {getMatchDisplayStr, matchResults} = useDataContext();

    if (referredMatches.length === 0) return null;

    // ヘッダーセルの処理
    if (row === -1 && col === -1)
        return (
            <p key={i_key} className="font-bold">
                {blockName}
            </p>
        );

    if (row === -1 && col > -1)
        return (
            <p key={i_key}>
                {getMatchDisplayStr(block[col]?.teamId)}
            </p>
        );

    if (col === -1 && row > -1)
        return (
            <p key={i_key} className="text-sm">
                {getMatchDisplayStr(block[row]?.teamId)}
            </p>
        );

    // 同じチームのセルは空にする
    if (row === col) return null;

    // 試合情報の取得
    const leftSideTeam = block[row]?.teamId;
    const rightSideTeam = block[col]?.teamId;
    const match = referredMatches.find((match) => {
        return (
            match.teamIds.includes(leftSideTeam) &&
            match.teamIds.includes(rightSideTeam)
        );
    });

    if (!match) return null;

    const matchStr = match.matchName
        ? match.matchName
        : match.matchNote
            ? match.matchNote
            : "";

    // 現在のチームと一致するかチェック
    const isCurrentTeamMatch = teamIds && match.teamIds === teamIds;
    const highlightClass = isCurrentTeamMatch ? "bg-amber-500" : "";
    const textClass = isCurrentTeamMatch ? "animate-pulse text-white text-[17px]" : "";

    if (match.status === "Waiting" || match.status === "Preparing") {
        return (
            <div key={i_key} className={`text-sm p-2 ${highlightClass}`}>
                <p className={`text-sm ${textClass}`}>
                    ({matchStr})
                </p>
            </div>
        );
    }

    if (match.status === "Playing") {
        return (
            <div key={i_key}
                 className={`text-sm p-2 arrow-flowing-bg ${isCurrentTeamMatch ? "bg-amber-500" : "bg-[rgba(200,255,200,.3)]"}`}>
                <p className={`text-sm ${textClass}`}>
                    ({matchStr})
                </p>
            </div>
        );
    }

    if (match.status === "Finished") {
        return (
            <div key={i_key} className={`text-sm p-2 ${highlightClass}`}>
                <p className={`text-sm ${textClass}`}>
                    ({matchStr})
                </p>
            </div>
        );
    }

    if (match.status === "Completed") {
        // 試合結果の表示
        const matchResult = matchResults?.[match.id];
        if (!matchResult) return null;

        const leftSideTeamIndex = match.teamIds.indexOf(leftSideTeam);
        const rightSideTeamIndex = match.teamIds.indexOf(rightSideTeam);
        if (leftSideTeamIndex === -1 || rightSideTeamIndex === -1) return null;

        const leftSideTeamScore = matchResult.matchScores[leftSideTeamIndex];
        const rightSideTeamScore = matchResult.matchScores[rightSideTeamIndex];
        const scoreStr = `${leftSideTeamScore} - ${rightSideTeamScore}`;

        return (
            <div key={i_key} className={`text-sm p-2 ${highlightClass}`}>
                <p className={`text-sm ${textClass}`}>
                    {scoreStr}
                </p>
            </div>
        );
    }

    return (
        <div key={i_key} className="text-sm p-2">
            <p>({matchStr})</p>
        </div>
    );
};

export default memo(LeagueTableCell);