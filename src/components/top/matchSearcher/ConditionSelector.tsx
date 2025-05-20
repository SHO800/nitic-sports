"use client"

import {memo, useCallback, useState} from "react";
import {SearchCondition} from "@/components/top/matchSearcher/MatchSearcher";
import ClassSelector from "@/components/common/ClassSelector";
import {useDataContext} from "@/contexts/dataContext";
import EventSwitch from "@/components/information/EventSwitch";

const ConditionSelector = ({setConditionCallback}: { setConditionCallback: (condition: SearchCondition) => void }) => {
    const {groupedTeams} = useDataContext()
    const [searchCondition, setSearchCondition] = useState<SearchCondition>({
        statuses: []
    })
    const [isShowClassSelector, setIsShowClassSelector] = useState<boolean>(false)

    const selectClassCallback = useCallback((id: string, name: string) => {
        const after: SearchCondition = {
            eventId: searchCondition.eventId,
            statuses: searchCondition.statuses,
            attendTeam: [parseInt(id), name]
        }
        setSearchCondition(after)
        setConditionCallback(after)
        setIsShowClassSelector(false)
    }, [searchCondition])
    const clearClass = useCallback(() => {
        const after: SearchCondition = {
            eventId: searchCondition.eventId,
            statuses: searchCondition.statuses,
        }
        setSearchCondition(after)
        setConditionCallback(after)
    }, [searchCondition])
    
    const setEventId = useCallback((eventId: number | "all") => {
        let expandedEventId: number | undefined  = eventId === "all" ? undefined: eventId
        const after: SearchCondition = {
            eventId: expandedEventId,
            statuses: searchCondition.statuses,
            attendTeam: searchCondition.attendTeam
        }
        setSearchCondition(after)
        setConditionCallback(after)
    }, [searchCondition])

    return (
        
        <div className={"flex flex-col"}>
            
            <div className={"w-full flex flex-col items-center"}>
                <p className={"text-xl w-full text-center"}>参加チームで絞り込む</p>
                {isShowClassSelector && 
                    <ClassSelector groupedData={groupedTeams} isShowVariableId={false} callback={selectClassCallback}/>
                }
                {
                    searchCondition.attendTeam && 
                    <div className={"flex flex-col items-center"}>
                        <p>選択中のチーム</p>
                         <p className={"text-xl"}>{searchCondition.attendTeam[1]}</p>
                        <button className={""}
                                onClick={e => {
                                    e.preventDefault()
                                    clearClass()
                                }}
                                >
                            選択解除
                        </button>
                    </div>
                }
                {
                 !searchCondition.attendTeam &&   
                <button
                    className={""}
                    onClick={e => {
                        e.preventDefault()
                        setIsShowClassSelector(true)
                    }}
                >
                 選択   
                </button>
                }
            </div>
            
            <div>
                <div className={"w-full flex flex-col items-center"}>
                    <p className={"text-xl w-full text-center"}>種目で絞り込む</p>
                    <EventSwitch selectedId={!searchCondition.eventId ? "all": searchCondition.eventId} setSelectedId={setEventId} isAllDay={true} />
                </div>
            </div>
            <div>
                
            </div>
        </div>
    )

}


export default memo(ConditionSelector)