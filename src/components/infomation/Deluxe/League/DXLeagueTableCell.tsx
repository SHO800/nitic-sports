import {useData} from "@/hooks/data";
import {MatchPlan} from "@prisma/client";

const DXLeagueTableCell = ({i_key, row, col, blockName, block, referredMatches, teamIds}: {
    i_key: string,
    row: number,
    col: number,
    blockName: string,
    block: { teamId: string }[],
    referredMatches: MatchPlan[],
    teamIds: string[]
}) => {
    const {getMatchDisplayStr, matchResults} = useData()

    if (referredMatches.length === 0) return null;
    if (row === -1 && col === -1) return <p key={i_key} className={"font-bold"}>{blockName}</p>
    if (row === -1 && col > -1) return <p key={i_key} className={""}>{getMatchDisplayStr(block[col]?.teamId)}</p>
    if (col === -1 && row > -1) return <p key={i_key} className={"text-sm"}>{getMatchDisplayStr(block[row]?.teamId)}</p>
    if (row === col) return null;
    const leftSideTeam = block[row]?.teamId;
    const rightSideTeam = block[col]?.teamId;
    const match = referredMatches.find((match) => {
        return match.teamIds.includes(leftSideTeam) && match.teamIds.includes(rightSideTeam);
    });
    if (!match) return null;
    // const leftSideTeamName = getMatchDisplayStr(leftSideTeam);
    // const rightSideTeamName = getMatchDisplayStr(rightSideTeam);
    // const teamStr = `${leftSideTeamName} vs ${rightSideTeamName}`;
    const matchStr = match.matchName ? match.matchName : match.matchNote ? match.matchNote : "";
    
    if (match.status === "Waiting") {
        return (
            
            <div key={i_key} className={`text-sm p-2 ${(match.teamIds === teamIds) ? "bg-amber-500": ""}`}>
                <p className={`text-sm ${(match.teamIds === teamIds) ?"animate-pulse text-white text-[17px]" : ""}`}>({matchStr})</p>
            </div>
        )
    }
    if (match.status === "Preparing") {
        return (
            <div key={i_key} className={`text-sm p-2 ${(match.teamIds === teamIds) ? "bg-amber-500": ""}`}>
                <p className={`text-sm ${(match.teamIds === teamIds) ?"animate-pulse text-white text-[17px]" : ""}`}>({matchStr})</p>
            </div>
        )
    }
    if (match.status === "Playing") {
        return (
            <div key={i_key} className={`text-sm p-2 arrow-flowing-bg ${(match.teamIds === teamIds) ? "bg-amber-500": "bg-[rgba(200,255,200,.3)]"}`}>
                <p className={`text-sm ${(match.teamIds === teamIds) ?"animate-pulse text-white text-[17px]" : ""}`}>({matchStr})</p>
                
            </div>
        )
    }
    if (match.status === "Finished") {
        return (
            <div key={i_key} className={`text-sm p-2 ${(match.teamIds === teamIds) ? "bg-amber-500": ""}`}>
                <p className={`text-sm ${(match.teamIds === teamIds) ?"animate-pulse text-white text-[17px]" : ""}`}>({matchStr})</p>
                
            </div>
        )
    }
    if (match.status === "Completed") {
        // statusがCompletedの時はmatchResultsが存在する
        const matchResult = matchResults![match.id];
        if (!matchResult) return null;
        
        const leftSideTeamIndex = match.teamIds.indexOf(leftSideTeam);
        const rightSideTeamIndex = match.teamIds.indexOf(rightSideTeam);
        if (leftSideTeamIndex === -1 || rightSideTeamIndex === -1) return null;
        const leftSideTeamScore = matchResult.matchScores[leftSideTeamIndex];
        const rightSideTeamScore = matchResult.matchScores[rightSideTeamIndex];
        const scoreStr = `${leftSideTeamScore} - ${rightSideTeamScore}`;
        
        return (
            <div key={i_key} className={`text-sm p-2 ${(match.teamIds === teamIds) ? "bg-amber-500": ""}`}>
                <p className={`text-sm ${(match.teamIds === teamIds) ?"animate-pulse text-white text-[17px]" : ""}`}>{scoreStr}</p>
            </div>
        )
    }

    return (
        <div key={i_key} className={"text-sm p-2"}>
                    <p className={""}>{matchStr}</p>
        </div>
    )

}
export default DXLeagueTableCell;
