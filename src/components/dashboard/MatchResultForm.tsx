import {MatchPlan, MatchResult} from "@prisma/client";
import {useData} from "@/hooks/data";
import {useEffect, useState} from "react";
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";

export const MatchResultForm = ({matchPlan, matchResult}: { matchPlan: MatchPlan, matchResult?: MatchResult }) => {
    const {
        matchPlans,
        pullMatchPlan,
        matchResults,
        pullMatchResult,
        getMatchDisplayStr,
        getLeagueDataByVariableId,
        isFixedMatchResultOrBlockRankByVariableId
    } = useData()

    

    const [actualTeamIds, setActualTeamIds] = useState<number[]>(matchResult? matchResult.teamIds : []);
    const [actualMatchScores, setActualMatchScores] = useState<string[]>(matchResult? matchResult.matchScores : []);
    const [actualWinnerTeamId, setActualWinnerTeamId] = useState<number>(matchResult? matchResult.winnerTeamId : 0);
    const [actualLoserTeamId, setActualLoserTeamId] = useState<number | null>(matchResult? matchResult.loserTeamId : null); // 複数対戦の場合はそもそも表示しない
    const [actualResultNote, setActualResultNote] = useState<string>(matchResult?.resultNote ? matchResult.resultNote : "");
    const [actualResultSecretNote, setActualResultSecretNote] = useState<string>(matchResult?.resultSecretNote ? matchResult.resultSecretNote : "");
    const [actualStartedAt, setActualStartedAt] = useState<Date>(matchResult?.startedAt ? matchResult.startedAt : new Date());
    const [actualEndedAt, setActualEndedAt] = useState<Date>(matchResult?.endedAt ? matchResult.endedAt : new Date());
    const [actualIsCanceled, setActualIsCanceled] = useState<boolean>(matchResult? matchResult.isCanceled : false);
    const [actualCancelNote, setActualCancelNote] = useState<string>(matchResult?.cancelNote ? matchResult.cancelNote : "");

    const [canInput, setCanInput] = useState<boolean>(true);

    useEffect(() => {
        if (matchPlans.length < 1) return;
        if (!matchPlan) return;

        // 他の試合結果に依存するチームがないか検索
        const variableTeamIds = matchPlan.teamIds.filter(id => id.startsWith("$"))

        // もしいずれかの対戦チームが他の試合の結果に依存している場合
        if (variableTeamIds.length > 0) {
            // すべての依存試合の結果が確定していなければこの試合結果を入力できないようにする
            setCanInput(variableTeamIds.every(id => isFixedMatchResultOrBlockRankByVariableId(id)))
            
        }
        // 最初からactualTeamIdsに当初予定されていたteamIdsをいれる処理
        const defaultTeamIds = matchPlan.teamIds.map((teamId): number => {
            if (!teamId.startsWith("$")) {
                return Number(teamId)
            } else { // もし他の試合結果依存だった場合
                // その結果が確定していたならその結果を代入
                if (isFixedMatchResultOrBlockRankByVariableId(teamId)) {
                    // 依存している試合の結果を取得
                    const analyzedTeamId = analyzeVariableTeamId(teamId)
                    if (analyzedTeamId === null) return -1;
                    if (analyzedTeamId.type === "T") {
                        if (analyzedTeamId.condition === "W") 
                            return matchResults[analyzedTeamId.matchId]?.winnerTeamId ?? -1
                        else 
                            return matchResults[analyzedTeamId.matchId]?.loserTeamId ?? -1
                    } else if (analyzedTeamId.type === "L") {
                        // もしリーグ戦の結果だった場合
                        // 該当するリーグ戦の結果を取得
                        const leagueData = getLeagueDataByVariableId(teamId)
                        if (leagueData) {
                            // 該当する順位のチームを取得
                            if (!leagueData.teams) return -1;
                            const team = leagueData.teams.find((team) => team.rank === analyzedTeamId.expectedRank)
                            if (team) {
                                return team.teamId
                            } else {
                                // 該当する順位のチームが見つからなかった場合
                                return -1;
                            }
                        }
                    }
                    return -1;
                }
                else return -1; // 別の箇所でそもそも入力不可にする処理が走るので空でok
            }
        })
        setActualTeamIds(defaultTeamIds);
    }, [matchPlans]);

    useEffect(() => {
        if (matchPlan && matchPlan.teamIds.length > 0) {
            const defaultMatchScores = Array(matchPlan.teamIds.length).fill("")
            setActualMatchScores(defaultMatchScores)
        }
    }, [matchPlan])
    useEffect(() => {
        if (matchResult) {
            setActualMatchScores(matchResult.matchScores)
        }
    }, [matchResult])

    return (
        <div>
            <div className={`flex items-center ${canInput ? '' : 'opacity-50 pointer-events-none'}`}>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault()
                        const response = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/match-result/${matchPlan.id}`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    matchPlanId: matchPlan.id,
                                    resultNote: actualResultNote,
                                    secretNote: actualResultSecretNote,
                                    startedAt: actualStartedAt,
                                    endedAt: actualEndedAt,
                                    isCanceled: actualIsCanceled,
                                    cancelNote: actualCancelNote,
                                    matchScores: actualMatchScores,
                                    winnerTeamId: actualWinnerTeamId,
                                    loserTeamId: actualLoserTeamId,
                                    teamIds: actualTeamIds,
                                }),
                            }
                        )
                        const newMatchResult = await response.json()
                        await pullMatchResult(newMatchResult)
                        await pullMatchPlan()
                        alert("試合結果を更新しました！ 反映には再読み込みが必要なことがあります。")
                    }
                    }
                >
                    {/*チームごとに枠を用意*/}
                    {
                        matchPlan.teamIds.map((teamId, index) => (
                            <div key={"matchResultTeam" + index}>
                                {getMatchDisplayStr(teamId)}: <input
                                type='text'
                                name={`matchResult${index}`}
                                id={`matchResult${index}`}
                                className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                                placeholder='スコア'
                                required
                                disabled={!canInput}
                                onChange={(e) => {
                                    const newMatchScores = [...actualMatchScores]
                                    newMatchScores[index] = e.target.value
                                    setActualMatchScores(newMatchScores)
                                }}
                                value={actualMatchScores[index] || ""}
                            />
                                <input type="radio" name={"matchResultWinner-" + matchPlan.id}
                                       id={`matchResult-${matchPlan.id}-${index}`} required value={teamId}
                                       disabled={!canInput}
                                       onChange={(e) => {
                                           setActualWinnerTeamId(Number(e.target.value))
                                       }}
                                        checked={actualWinnerTeamId === Number(teamId)}
                                />
                            </div>
                        ))

                    }
                    <button
                        type='submit'
                        className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
                        disabled={!canInput}
                    >
                        更新
                    </button>
                </form>
            </div>
        </div>
    )

}
