"use client"
import {MatchPlan as MatchPlanType} from "@prisma/client";
import {MatchResultForm} from "@/components/dashboard/MatchResultForm";
import {MatchResult as MatchResultType} from "@prisma/client";

type MatchResultProps = {
    matchPlan: MatchPlanType;
    matchResults: Record<number, MatchResultType> | undefined;
    getMatchDisplayStr: (teamId: string) => string;
};

const MatchResult = ({matchPlan, matchResults, getMatchDisplayStr}: MatchResultProps) => {
    const matchResult = matchResults ? matchResults[matchPlan.id] : undefined;
    const matchTime = matchPlan.startedAt && matchPlan.endedAt ? 
        Math.floor((new Date(matchPlan.endedAt).getTime() - new Date(matchPlan.startedAt).getTime()) / 1000 / 60) : 0;
    
    
    return (
        <>
            {matchResult ? (
                <div>
                    <div className="text-black">
                        終了: {matchResult.teamIds.map((teamId: number, index: number) => (
                        <p key={"score" + index} className="text-black ml-2">
                            {`${getMatchDisplayStr(teamId.toString())}:${matchResult.matchScores[index]}`}
                            {matchResult.winnerTeamId === teamId ? (
                                <span className="ml-1"> ☆ </span>
                                
                            ) : null}
                        </p>

                    ))}
                        {
                            matchTime >= 0 ?
                                <p>試合時間: {matchTime}分</p>
                                : null
                        }
                        {matchResult.resultNote && matchResult.resultNote.length > 0 ? (
                            <p>試合結果メモ: {matchResult.resultNote}</p>
                            
                        ) : null}
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-black">
                        試合結果はまだ登録されていません
                    </p>
                </div>
            )}
            {matchPlan.status === "Finished" && matchPlan.startedAt && matchPlan.endedAt &&
                
                <details className="text-black pl-4">
                    <summary>試合結果入力</summary>
                    <MatchResultForm
                        matchPlan={matchPlan}
                        matchResult={matchResult}
                    />
                </details>
            }
        </>
    );
};

export default MatchResult;
