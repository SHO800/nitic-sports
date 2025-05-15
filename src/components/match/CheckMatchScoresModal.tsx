import {useCallback, useEffect, useState} from "react";
import {useData} from "@/hooks/data";
import {Event} from "@prisma/client";
import {calcEventScore} from "@/utils/calcEventScore";
import {createScores} from "@/app/actions/data";
import LoadingButton from "@/components/common/LoadingButton";

const CheckMatchScoresModal = ({unSettledEvents}: { unSettledEvents: Event[] }) => {
    const {matchResults, scores} = useData()

    const [isOpen, setIsOpen] = useState<boolean>(false)


    return (
        <>
            <ModalTab isOpen={isOpen} setIsOpen={setIsOpen}/>
            <div
                className={`fixed w-screen h-screen top-0 overflow-hidden ${isOpen ? "block" : "hidden"} py-18 bg-[rgba(0,0,0,.5)] z-20 border-gray-400 border-2 overscroll-contain`}
                onClick={() => setIsOpen(false)}
                onScroll={(e) => e.preventDefault()}
            >
                <div
                    className="flex flex-col items-center justify-center w-fit h-[calc(100%-12em)] m-24 mx-auto px-12 bg-white "
                    onClick={(e) => e.stopPropagation()}
                >
                    {unSettledEvents.map(event => (
                        <ModalEventContainer key={"scoreSetModal-" + event.id} unsettledEvent={event}/>
                    ))}

                </div>

            </div>
        </>
    )
}


const ModalTab = ({isOpen, setIsOpen}: { isOpen: boolean, setIsOpen: (value: boolean) => void }) => {

    return (
        <div
            className={`${isOpen ? "-right-full" : "right-0"} fixed top-18 h-28 w-7  border-l-4 border-t-4 border-b-4 rounded-l-md border-gray-500  bg-white`}
            onClick={() => setIsOpen(!isOpen)}
        >
            種目順位
            <div className={"absolute animate-ping bg-blue-400 h-3 w-3 -left-2 -top-2 rounded-full "}/>
            <div className={"absolute  bg-blue-600 h-3 w-3 -left-2 -top-2 rounded-full"}/>

        </div>
    )
}


export default CheckMatchScoresModal;

const ModalEventContainer = ({unsettledEvent}: { unsettledEvent: Event }) => {
    const {matchPlans, matchResults, getMatchDisplayStr} = useData()
    const [calculatedScore, setCalculatedScore] = useState<RankWithEventScore[][]>([])
    const [mergedScore, setMergedScore] = useState<RankWithEventScore[]>([])
    const [isConfirming, setIsConfirming] = useState<boolean>(false) 

    useEffect(() => {
        if (!matchPlans || !matchResults) return;
        const separatedScore = calcEventScore(unsettledEvent, matchPlans, Object.values(matchResults))
        setCalculatedScore(separatedScore)
        const mergedScore = structuredClone(calculatedScore).flat().reduce((acc: RankWithEventScore[], curr: RankWithEventScore) => {
            // idが同じものを結合
            console.log("マージ前", acc, curr)
            const existing = acc.find(item => item.teamId === curr.teamId);
            if (existing) {
                existing.score += curr.score;
                existing.detail = existing.detail ? existing.detail + "," + curr.detail : curr.detail
                return acc
            } else {
                return [...acc, curr]
            }
        }, [])

        setMergedScore(mergedScore)

        console.log("マージド", mergedScore)

    }, [matchPlans, matchResults, unsettledEvent]);
    
    
    const confirmEventScores = useCallback(async ()=>{
        await createScores(mergedScore)
        
    }, []) 
    
    return (
        <div className={"flex flex-col"}>
            <p className={"text-2xl mb-4"}>{unsettledEvent.name}</p>
            <div className={"w-full h-full flex flex-row items-start space-x-8 text-xl overflow-y-scroll"}>

                {calculatedScore.map((scores, index) => {
                        return (
                            <div key={"scoreSetModal-" + unsettledEvent.id + "-" + index}
                                 className={"flex flex-col space-y-2"}>
                                <p className={"font-bold "}>{calculatedScore.length === index + 1 ? "本戦" : "予選"}</p>
                                {
                                    scores.toSorted((a, b) => a.rank - b.rank).map(score => {

                                        if (score.score === 0) return null

                                        return (
                                            <div
                                                key={"scoreSetModal-" + unsettledEvent.id + "-" + index + "-" + score.teamId}
                                                className={"ml-4"}>
                                                <span className={""}>{score.rank}位</span>: <span
                                                className={"ml-4 w-18 inline-block"}>{getMatchDisplayStr(score.teamId)}</span>
                                                <span className={"w-18 inline-block"}>{score.score}点</span>

                                                ({score.detail?.toString()})
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                )}
                <div className={"h-fit w-fit my-auto"}>
                    →
                </div>
                <div className={"flex flex-col space-y-2  -ml-4 mr-2"}>
                    <p className={"font-bold"}>最終的な加点</p>
                    {mergedScore.toSorted((a, b) => b.score - a.score).map((score, index) => {
                        if (score.score === 0) return null

                        return (
                            <div key={"scoreSetModal-merged-" + unsettledEvent.id + "-" + index + "-" + score.teamId}
                                 className={"ml-4"}>
                                <span className={"w-18 inline-block"}>{getMatchDisplayStr(score.teamId)}</span>: <span
                                className={"w-18 inline-block"}>{score.score}点</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={"ml-auto mt-8"}>
                
            <LoadingButton onClick={confirmEventScores} bgColor={"green"} textColor={"white"} isLoading={isConfirming}>
                確定
            </LoadingButton>
            </div>
        </div>
    )
}