"use client"

import {memo, useCallback, useState} from "react";
import {SearchCondition} from "@/components/top/matchSearcher/MatchSearcher";
import ClassSelector from "@/components/common/ClassSelector";
import {useDataContext} from "@/contexts/dataContext";
import EventSwitch from "@/components/information/EventSwitch";

const MATCH_STATUS_LABELS = [
  { value: "waiting", label: "開始前" },
  { value: "preparing", label: "開始前" },
  { value: "playing", label: "進行中" },
  { value: "completed", label: "終了済" },
  { value: "finished", label: "終了済" },
];

const STATUS_GROUPS = [
  { group: "開始前", values: ["waiting", "preparing"] },
  { group: "進行中", values: ["playing"] },
  { group: "終了済", values: ["completed", "finished"] },
];

const ConditionSelector = ({setConditionCallback}: { setConditionCallback: (condition: SearchCondition) => void }) => {
    const {groupedTeams} = useDataContext()
    const [searchCondition, setSearchCondition] = useState<SearchCondition>({
        statuses: []
    })
    const [isShowClassSelector, setIsShowClassSelector] = useState<boolean>(false)
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    const selectClassCallback = useCallback((id: string, name: string) => {
        const after: SearchCondition = {
            eventId: searchCondition.eventId,
            statuses: searchCondition.statuses,
            attendTeam: [parseInt(id), name]
        }
        setSearchCondition(after)
        setConditionCallback(after)
        setIsShowClassSelector(false)
    }, [searchCondition.eventId, searchCondition.statuses, setConditionCallback])
    const clearClass = useCallback(() => {
        const after: SearchCondition = {
            eventId: searchCondition.eventId,
            statuses: searchCondition.statuses,
        }
        setSearchCondition(after)
        setConditionCallback(after)
    }, [searchCondition.eventId, searchCondition.statuses, setConditionCallback])
    
    const setEventId = useCallback((eventId: number | "all") => {
        const expandedEventId: number | undefined  = eventId === "all" ? undefined: eventId
        const after: SearchCondition = {
            eventId: expandedEventId,
            statuses: searchCondition.statuses,
            attendTeam: searchCondition.attendTeam
        }
        setSearchCondition(after)
        setConditionCallback(after)
    }, [searchCondition.attendTeam, searchCondition.statuses, setConditionCallback])

    return (
        
        <div className={"flex flex-col space-y-2"}>
            <div className={"w-full flex flex-col items-center relative"}>
                <p className={"text-xl w-full text-center"}>クラスで絞り込む</p>
                {isShowClassSelector && 
                    <div className={"absolute left-1/2 top-1/2 z-20 w-fit h-fit"} style={{transform: "translate(-50%, -50%)"}}>
                        <ClassSelector groupedData={groupedTeams} isShowVariableId={false} callback={selectClassCallback}/>
                    </div>
                }
                {
                    searchCondition.attendTeam && 
                    <div className={"flex flex-col items-center"}>
                        <p>選択中のチーム</p>
                         <p className={"text-xl"}>{searchCondition.attendTeam[1]}</p>
                        <button className={"bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"}
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
                    className={"bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"}
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
            <div className="w-full flex flex-col items-center mt-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={searchCondition.includeFinished ?? false}
                        onChange={e => {
                            const after = {
                                ...searchCondition,
                                includeFinished: e.target.checked
                            };
                            setSearchCondition(after);
                            setConditionCallback(after);
                        }}
                    />
                    <span>終了した試合も含める</span>
                </label>
            </div>
        </div>
    )

}


export default memo(ConditionSelector)

