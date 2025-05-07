import {MatchPlan, MatchResult} from "@prisma/client";
import {useData} from "@/hooks/data";
import {useEffect, useState} from "react";
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";
import {createMatchResult} from "@/app/actions/data";

export const MatchResultForm = ({matchPlan, matchResult, isTimeBased = false}: { matchPlan: MatchPlan, matchResult?: MatchResult, isTimeBased: boolean}) => {
    const {
        matchPlans,
        mutateMatchPlans,
        matchResults,
        mutateMatchResults,
        getMatchDisplayStr,
        getLeagueDataByVariableId,
        isFixedMatchResultOrBlockRankByVariableId,
        getActualTeamIdByVariableId
    } = useData()


    const [actualTeamIds, setActualTeamIds] = useState<number[]>(matchResult ? matchResult.teamIds : []);
    const [actualMatchScores, setActualMatchScores] = useState<string[]>(matchResult ? matchResult.matchScores : []);
    const [actualWinnerTeamId, setActualWinnerTeamId] = useState<number>(matchResult ? matchResult.winnerTeamId : 0);
    const [actualLoserTeamId, setActualLoserTeamId] = useState<number | null>(matchResult ? matchResult.loserTeamId : null); // 複数対戦の場合はそもそも表示しない
    const [actualResultNote, setActualResultNote] = useState<string>(matchResult?.resultNote ? matchResult.resultNote : "");
    const [actualResultSecretNote, setActualResultSecretNote] = useState<string>(matchResult?.resultSecretNote ? matchResult.resultSecretNote : "");

    const [canInput, setCanInput] = useState<boolean>(true);

    useEffect(() => {
        if (!matchPlans || matchPlans.length < 1) return;
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
                        if (!matchResults) return -1;
                        if (analyzedTeamId.condition === "W")
                            return matchResults[analyzedTeamId.matchId]?.winnerTeamId ?? -1
                        else
                            return matchResults[analyzedTeamId.matchId]?.loserTeamId ?? -1
                    } else if (analyzedTeamId.type === "L") {
                        // もしリーグ戦の結果だった場合
                        // 該当するリーグ戦の結果を取得
                        const leagueData = getLeagueDataByVariableId(teamId)
                        if (leagueData && leagueData.type === "league") {
                            const blockName = analyzedTeamId.blockName
                            // 該当する順位のチームを取得
                            const team = leagueData.blocks[blockName].find((team) => team.rank === analyzedTeamId.expectedRank)
                            if (team) {
                                return Number(team.teamId)
                            } else {
                                // 該当する順位のチームが見つからなかった場合
                                return -1;
                            }
                        }
                    }
                    return -1;
                } else return -1; // 別の箇所でそもそも入力不可にする処理が走るので空でok
            }
        })
        setActualTeamIds(defaultTeamIds);
    }, [getLeagueDataByVariableId, isFixedMatchResultOrBlockRankByVariableId, matchPlan, matchPlans, matchResults]);

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
                        let scores = actualMatchScores
                        if (isTimeBased) {
                            scores = scores.map(score => {
                                const splitStr = score.split(":")
                                splitStr[0] = splitStr[0].padStart(2, "0")
                                splitStr[1] = splitStr[1].padStart(2, "0")
                                const splitStrSplitSec = splitStr[2].split(".")
                                splitStrSplitSec[0] = splitStrSplitSec[0].padStart(2, "0")
                                splitStrSplitSec[1] = splitStrSplitSec[1].padEnd(3, "0")
                                splitStr[2] = splitStrSplitSec.join(".")
                                return splitStr.join(":")
                            })
                        }
                        
                        await createMatchResult(
                            matchPlan.id,
                            matchPlan.eventId,
                            actualTeamIds,
                            scores,
                            actualWinnerTeamId,
                            actualLoserTeamId ?? undefined,
                            actualResultNote,
                            actualResultSecretNote,
                        )
                        await mutateMatchResults();
                        await mutateMatchPlans();
                    }
                    }
                >
                    {/*チームごとに枠を用意*/}
                    <table className={"mt-2 mb-4 border-separate border-spacing-y-1"}>
                        {/*チーム名, スコアorタイム, 勝者の3列*/}
                        <thead>
                        
                        <tr className={"w-full"}>
                            <th scope={"col"} className={"w-1/6"} >所属</th>
                            <th scope={"col"} className={"w-2/3"} >{isTimeBased ? "タイム" : "スコア"}</th>
                            <th scope={"col"} className={"w-1/6"} >勝者</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            matchPlan.teamIds.map((teamId, index) => {
                                const actualTeamId = getActualTeamIdByVariableId(teamId)
                                const ac = actualTeamId ? actualTeamId.toString() : teamId
                                return (
                                    <tr key={"matchResultTeam" + index} className={"h-12"}>
                                        <td className={"text-center"}>
                                            <p className={"text-[1.1em]"}>{getMatchDisplayStr(teamId)}</p>
                                        </td>
                                        <td className={"whitespace-nowrap text-center"}>
                                            {isTimeBased ?
                                                <>
                                                    <input 
                                                        type="tel"
                                                        name={`matchResult-${matchPlan.eventId}-${index}-hh`}
                                                        id={`matchResult-${matchPlan.eventId}-${index}-hh`}
                                                        className='border border-gray-400 px-0 mx-2 h-8 rounded text-black w-[10%] text-sm '
                                                        placeholder={'時間'}
                                                        disabled={!canInput}
                                                        onChange={(e) => {
                                                            const newMatchScores = [...actualMatchScores]
                                                            if (!newMatchScores[index]) newMatchScores[index] = "::."
                                                            const splitStr =  newMatchScores[index].split(":")
                                                            splitStr[0] = e.target.value
                                                            newMatchScores[index] = splitStr.join(":")// 結合
                                                            setActualMatchScores(newMatchScores)
                                                        }}
                                                        value={actualMatchScores[index] ? actualMatchScores[index].split(":")[0] : ""}
                                                    />
                                                    :
                                                    <input
                                                        type="tel"
                                                        maxLength={2}
                                                        name={`matchResult-${matchPlan.eventId}-${index}-mm`}
                                                        id={`matchResult-${matchPlan.eventId}-${index}-mm`}
                                                        className='border border-gray-400 px-0 mx-2 h-8 rounded text-black w-[15%] text-sm '
                                                        placeholder={'分'}
                                                        disabled={!canInput}
                                                        onChange={(e) => {
                                                            const newMatchScores = [...actualMatchScores]
                                                            if (!newMatchScores[index]) newMatchScores[index] = "::."
                                                            const splitStr =  newMatchScores[index].split(":")
                                                            splitStr[1] = e.target.value
                                                            newMatchScores[index] = splitStr.join(":")// 結合
                                                            setActualMatchScores(newMatchScores)
                                                        }}
                                                        value={actualMatchScores[index] ? actualMatchScores[index].split(":")[1] : ""}
                                                    />
                                                    :
                                                    <input
                                                        type="tel"
                                                        maxLength={2}
                                                        name={`matchResult-${matchPlan.eventId}-${index}-ss`}
                                                        id={`matchResult-${matchPlan.eventId}-${index}-ss`}
                                                        className='border border-gray-400 px-0 mx-2 h-8 rounded text-black w-[15%] text-sm '
                                                        placeholder={'秒'}
                                                        disabled={!canInput}
                                                        onChange={(e) => {
                                                            const newMatchScores = [...actualMatchScores]
                                                            if (!newMatchScores[index]) newMatchScores[index] = "::."
                                                            const splitStr =  newMatchScores[index].split(":")
                                                            const splitStrSplitSec = splitStr[2].split(".")
                                                            splitStrSplitSec[0] = e.target.value
                                                            splitStr[2] = splitStrSplitSec.join(".")
                                                            newMatchScores[index] = splitStr.join(":")// 結合
                                                            setActualMatchScores(newMatchScores)
                                                        }}
                                                        value={actualMatchScores[index] ? actualMatchScores[index].split(":")[2].split(".")[0] : ""}
                                                    />
                                                    .
                                                    <input
                                                        type="tel"
                                                        maxLength={3}
                                                        name={`matchResult-${matchPlan.eventId}-${index}-ss`}
                                                        id={`matchResult-${matchPlan.eventId}-${index}-ss`}
                                                        className='border border-gray-400 px-0 mx-2 h-8 rounded text-black w-[20%] text-sm '
                                                        placeholder={'ミリ秒'}
                                                        disabled={!canInput}
                                                        onChange={(e) => {
                                                            const newMatchScores = [...actualMatchScores]
                                                            if (!newMatchScores[index]) newMatchScores[index] = "::."
                                                            const splitStr =  newMatchScores[index].split(":")
                                                            const splitStrSplitSec = splitStr[2].split(".")
                                                            splitStrSplitSec[1] = e.target.value
                                                            splitStr[2] = splitStrSplitSec.join(".")
                                                            newMatchScores[index] = splitStr.join(":")// 結合
                                                            setActualMatchScores(newMatchScores)
                                                        }}
                                                        value={actualMatchScores[index] ? actualMatchScores[index].split(":")[2].split(".")[1] : ""}
                                                    />
                                                </>
                                                :
                                            <input
                                                type='number'
                                                name={`matchResult-${matchPlan.eventId}-${index}`}
                                                id={`matchResult-${matchPlan.eventId}-${index}`}
                                                className='border border-gray-400 px-2 py-1 mx-2 h-8 rounded text-black w-[calc(100%-1em)]'
                                                placeholder={'スコア'}
                                                required
                                                disabled={!canInput}
                                                onChange={(e) => {
                                                    const newMatchScores = [...actualMatchScores]
                                                    newMatchScores[index] = e.target.value
                                                    setActualMatchScores(newMatchScores)
                                                }}
                                                value={actualMatchScores[index] || ""}
                                            />
                                            }
                                        </td>
                                        <td>
                                            <input type="radio" name={"matchResultWinner-" + matchPlan.id}
                                                   id={`matchResult-${matchPlan.id}-${index}`} required value={ac}
                                                   disabled={!canInput}
                                                   onChange={(e) => {
                                                       setActualWinnerTeamId(Number(e.target.value))
                                                       const otherTeam = actualTeamIds.filter(ati => ati.toString() !== e.target.value)
                                                       if (otherTeam.length === 1) setActualLoserTeamId(otherTeam[0])
                                                   }}
                                                   checked={actualWinnerTeamId === Number(ac)}
                                                   className={"block w-full h-6 "}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                    <button
                        type='submit'
                        className='bg-green-500 hover:bg-green-400 text-white mt-1 px-4 py-2 rounded block mx-auto w-full'
                        disabled={!canInput}
                    >
                        更新
                    </button>
                </form>
            </div>
        </div>
    )

}
