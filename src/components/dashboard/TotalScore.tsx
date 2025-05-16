import {useData} from "@/hooks/data";
import {useCallback, useEffect, useState} from "react";

interface TotalTeamScore {
    [teamId: number]: number
}


const TotalScore = () => {
    const {scores, getMatchDisplayStr} = useData()
    const [totalScoreByTeam, setTotalScoreByTeam] = useState<TotalTeamScore>()
    const [displayContents, setDisplayContents] = useState<ScoresByTeam>()


    const consolidateScoresByTeam = useCallback(() => {
        if (!scores) return
        const tmp: TotalTeamScore = {}
        scores.forEach(score => {
            const groupScoresInTmp = tmp[score.teamId]
            if (groupScoresInTmp) {
                tmp[score.teamId] = groupScoresInTmp + score.score
            } else {
                tmp[score.teamId] = score.score
            }
        })
        setTotalScoreByTeam(tmp)

    }, [scores])
    
    useEffect(() => {
        consolidateScoresByTeam()
    }, [scores])

    return (
        <>
            {/*総合スコア*/}
            <div
                className='flex flex-col items-start justify-between bg-gray-200 p-2 rounded mb-2'
            >
                {totalScoreByTeam && 
                    Object.entries(totalScoreByTeam).map(([key, value]) => {
                        return (
                            <div
                                key={"total-score-"+ key}
                            >
                                {getMatchDisplayStr(key)}: {value}点</div>
                        )
                        
                    })
                }

            </div>
            {/*各スコア*/}
            <div
                className='flex items-center justify-between bg-gray-200 p-2 rounded mb-2'
            >
                    {JSON.stringify(scores)}
                {/*{scores && scores.toSorted().map(score => {*/}
                {/*    */}
                {/*    <div key={"score-"+score.id} className={`text-black `}>*/}
                {/*        {score.id}: {score.score}*/}
                {/*    </div>*/}
                {/*})}*/}
            </div>
        </>
    )
}

export default TotalScore