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
    includeFinished?: boolean
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
        if (!matchPlans) return;
        let tmpResult: MatchPlan[] = [...matchPlans];
        // 「終了した試合も含める」がOFFなら、completed/finished以外のみ表示
        if (!condition.includeFinished) {
            tmpResult = tmpResult.filter(match => match.status !== Status.Completed && match.status !== Status.Finished);
        }
        if (condition.eventId) {
            tmpResult = tmpResult.filter(match => match.eventId === condition.eventId);
        }
        if (condition.attendTeam) {
            // @ts-ignore
            tmpResult = tmpResult.filter(match => match.teamIds.map(id => getActualTeamIdByVariableId(id)).includes(condition.attendTeam[0]));
        }
        setSearchResults(tmpResult);
    }, [matchPlans, getActualTeamIdByVariableId]);


    return (
        <details className={"mt-16 border-yello-400 border-2 rounded m-6 group"}>
            <summary className="relative flex justify-center mx-2 my-1 rounded h-12 bg-background cursor-pointer select-none py-2">
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl group-open:rotate-90 transition-transform">▶</span>
                <span className="text-3xl text-black bg-background px-4 tracking-wider">試合を検索する</span>
            </summary>
            <div className="flex justify-center flex-col mx-1 lg:mx-20 mb-2 p-1 rounded border-t-2 border-gray-400">
                <p className="absolute -top-0 text-lg text-black bg-background px-4 tracking-widest">SEARCH!!</p>
                <ConditionSelector setConditionCallback={setSearchCondition}/>
                <div>
                    <p className={"text-xl w-full text-center mt-8"}>検索結果</p>
                    <div className={"w-[calc(100%-64px)] mx-8"}>
                        {searchResults.map((match) => {
                            return (
                                <div key={`searchResult-${match.id}`} className={"border-2 border-gray-400 rounded my-2"}>
                                    <MatchInfoForReader  matchPlan={match}
                                                        events={events}
                                                        locations={locations} getMatchDisplayStr={getMatchDisplayStr}/>
                                </div>
                            )
                        })}
                    </div>
                    <p className={"ml-auto mr-8 mt-6 text-gray-600 "}>※対戦チームが確定していない試合は検索対象外</p>
                </div>
            </div>
        </details>
    )
}

export default memo(MatchSearcher)

