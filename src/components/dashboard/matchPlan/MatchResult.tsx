"use client"
import {MatchPlan as MatchPlanType, MatchResult as MatchResultType, Event} from "@prisma/client";
import {MatchResultForm} from "@/components/dashboard/MatchResultForm";

type MatchResultProps = {
    matchPlan: MatchPlanType;
    matchResults: Record<number, MatchResultType> | undefined;
    event: Event
    getMatchDisplayStr: (teamId: string) => string;
};

const MatchResult = ({matchPlan, matchResults, event, getMatchDisplayStr}: MatchResultProps) => {
    const matchResult = matchResults ? matchResults[matchPlan.id] : undefined;
    const matchTime = matchPlan.startedAt && matchPlan.endedAt ?
        Math.floor((new Date(matchPlan.endedAt).getTime() - new Date(matchPlan.startedAt).getTime()) / 1000 / 60) : 0;


    return (
        <>
            {matchResult ? (
                <div>
                    <div className="text-black">

                        <table className={"mb-2 mx-auto"}>
                            <thead>
                            <tr className={"w-full "}>
                                <th scope={"col"} className={"w-1/3 "}>所属</th>
                                <th scope={"col"} className={"w-1/3 "}>{event.isTimeBased ? "タイム" : "スコア"}</th>
                                <th scope={"col"} className={"w-1/3 "}>勝者</th>
                            </tr>
                            </thead>
                            <tbody>
                            {matchResult.teamIds.map((teamId: number, index: number) => {
                                return (
                                    <tr key={"matchResultTeam" + index}
                                        className={"h-8 text-[1.1em] border-y-2 border-gray-400"}>
                                        <td>
                                            <p className={"text-center"}>{getMatchDisplayStr(teamId.toString())}</p>
                                        </td>
                                        <td>
                                            <p className={"text-center"}>{matchResult.matchScores[index]}</p>
                                        </td>
                                        <td>
                                            <p className={"text-center"}>{matchResult.winnerTeamId === teamId ? (
                                                <span className="ml-1"> ○ </span>
                                            ) : null}</p>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                            </tbody>
                        </table>


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
            ) : null}
            {matchPlan.status === "Finished" && matchPlan.startedAt && matchPlan.endedAt &&
                <MatchResultForm
                    matchPlan={matchPlan}
                    matchResult={matchResult}
                    isTimeBased={event.isTimeBased}
                />
            }
        </>
    );
};

export default MatchResult;
