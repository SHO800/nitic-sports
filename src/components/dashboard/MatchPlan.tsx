"use client"
import {useData} from "@/hooks/data";
import {MatchResultForm} from "@/components/dashboard/MatchResultForm";
import AddMatchPlanForm from "@/components/dashboard/AddMatchPlanForm";

const MatchPlan = () => {
    const {
        matchPlans,
        locations,
        matchResults,
        mutateMatchPlans,
        getMatchDisplayStr
    } = useData()

    return (
        <>
            {matchPlans?.map((matchPlan) => (
                <div
                    key={matchPlan.id}
                    className='flex flex-col justify-start items-start bg-gray-200 p-2 rounded mb-2 w-full'
                >
                    <div className={"flex items-center justify-between "}>
                        <div className='flex items-center'>
                            <p className={`text-black `}>
                                {/*XX月XX日 XX:XX ~ XX:XX*/}
                                {matchPlan.id},
                                {matchPlan.teamIds.map((teamId) => getMatchDisplayStr(teamId))}
                                {new Date(matchPlan.scheduledStartTime).toLocaleString('ja-JP', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })} ~ {new Date(matchPlan.scheduledEndTime).toLocaleString('ja-JP', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                                {matchPlan.teamNotes}
                                {matchPlan.locationId && locations?.find((location) => location.id === matchPlan.locationId)?.name},
                                {matchPlan.matchName},

                            </p>
                        </div>

                        {/*削除ボタン*/}
                        <button
                            onClick={async (e) => {
                                e.preventDefault()
                                const response = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_URL}/match-plan/${matchPlan.id}`,
                                    {
                                        method: 'DELETE',
                                    }
                                )
                                console.log(response)
                                await mutateMatchPlans();
                            }}
                            className='bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded'
                        >
                            削除
                        </button>
                    </div>
                    {/*時間*/}
                    <div>


                    </div>
                    {/*    表示*/}
                    {matchResults && matchResults[matchPlan.id] ? (
                        <div>

                            <div className={`text-black `}>
                                終了: {matchResults[matchPlan.id]!.teamIds.map((teamId, index) => {
                                return (
                                    <p key={"score" + index} className={`text-black ml-2 `}>
                                        {`${getMatchDisplayStr(teamId)}:${matchResults[matchPlan.id]!.matchScores[index]}`}
                                    </p>
                                )
                            })}
                            </div>
                        </div>
                    ) : (
                        <div>

                            <p className={`text-black `}>
                                試合結果はまだ登録されていません
                            </p>
                        </div>
                    )}
                    <details className={"text-black pl-4"}>
                        <summary>試合結果入力</summary>
                        <MatchResultForm matchPlan={matchPlan} matchResult={matchResults ? matchResults[matchPlan.id] : undefined}/>
                    </details>
                </div>
            ))}
            <AddMatchPlanForm/>
        </>
    )
}
export default MatchPlan;