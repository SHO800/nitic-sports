"use client"

import {memo, useCallback, useState} from "react";
import {useDataContext} from "@/contexts/dataContext";
import {MatchPlan, Status} from "@prisma/client";
import ConditionSelector from "@/components/top/matchSearcher/ConditionSelector";
import MatchInfoForReader from "@/components/reader/MatchInfoForReader";

export interface SearchCondition {
    attendTeam?: [number, string]
    eventId?: number
    statuses: Status[]
}

const MatchSearcher = () => {
    const {
        matchPlans,
        locations,
        events,
        matchResults,
        getMatchDisplayStr,
        getActualTeamIdByVariableId
    } = useDataContext()
    const [searchResults, setSearchResults] = useState<MatchPlan[]>([])

    const setSearchCondition = useCallback((condition: SearchCondition) => {
        // 検索する
        if (!matchPlans) return
        if (condition.statuses.length === 0 && !condition.eventId && !condition.attendTeam) return
        let tmpResult: MatchPlan[] = [...matchPlans]
        if (condition.statuses && condition.statuses.length > 0) {
            tmpResult = tmpResult.filter(match => condition.statuses.includes(match.status))
        }
        if (condition.eventId) {
            tmpResult = tmpResult.filter(match => match.eventId === condition.eventId)
        }
        if (condition.attendTeam) {
            // @ts-ignore
            tmpResult = tmpResult.filter(match => match.teamIds.map(id => getActualTeamIdByVariableId(id)).includes(condition.attendTeam[0]))
        }

        setSearchResults(tmpResult)
    }, [matchPlans])


    return (
        <div className={"mt-16 border-yello-400 border-2 rounded m-6"}>
            <h1 className="relative flex justify-center mx-2 my-1 rounded h-8 bg-background">
                <p className="absolute -top-8 text-3xl text-black bg-background px-4 tracking-wider">試合を検索する</p>
                <p className="absolute -top-0 text-lg text-black bg-background px-4 tracking-widest">SEARCH!!</p>
            </h1>

            <div className="flex justify-center flex-col mx-1 lg:mx-20 mb-2 p-1 rounded">
                <details className={""}>
                    <summary>表示</summary>


                    <ConditionSelector setConditionCallback={setSearchCondition}/>
                    <div>

                        <p className={"text-xl w-full text-center mt-8"}>検索結果</p>
                        <div className={"w-[calc(100%-64px)] mx-8"}>
                            {searchResults.map((match) => {
                                return (
                                    <MatchInfoForReader key={`searchResult-${match.id}`} matchPlan={match}
                                                        events={events}
                                                        locations={locations} getMatchDisplayStr={getMatchDisplayStr}/>
                                )
                            })}
                        </div>
                    </div>
                </details>
            </div>
        </div>
    )
}

export default memo(MatchSearcher)