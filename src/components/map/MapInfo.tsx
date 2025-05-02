import { useState } from "react";
import { useData } from "@/hooks/data";
import MatchInfoForReader from "../reader/MatchInfoForReader";
import { Status, MatchPlan as MatchPlanType } from "@prisma/client";
import MatchCountdownForInfo from "../infomation/MatchCountdownForInfo";

type Props =
    | {placeId: number | null;}

const MapInfo = ({placeId}:Props) => {

    const [matchStatuses, setMatchStatuses] = useState<Record<number, Status>>({});
        
    const {
        matchPlans,
        events,
        locations,
        matchResults,
        getMatchDisplayStr
    } = useData();

    const filteredItems = matchPlans?.filter((item) => item.locationId === placeId)

    const getMatchStatus = (matchPlan: MatchPlanType): Status => {
        // すでにローカル状態にステータスがある場合はそれを返す
        if (matchStatuses[matchPlan.id] !== undefined) {
            return matchStatuses[matchPlan.id];
        }
        
        // すでに結果がある場合はCompletedステータス
        if (matchResults && matchResults[matchPlan.id]) {
            return Status.Completed;
        }
        
        // デフォルトはDBから来るステータスを使用するか、なければPreparingとみなす
        return matchPlan.status || Status.Preparing;
    };

    if(filteredItems?.length === 0){
        return(
            <div className="flex flex-col justify-center">
                <div className="flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[40vw] min-h-[30vh] bg-gray-100 rounded overflow-auto">
                    <p>本日の営業は終了いたしました</p>
                </div>
            </div>
        )
    }

    return(
        <div className="flex flex-col justify-center">
                <div className="flex flex-col lg:mx-20 px-1 py-2 min-w-[40vw] min-h-[30vh] bg-gray-100 rounded overflow-auto">
                    {filteredItems?.map((item) => {
                        
                        const status = getMatchStatus(item);

                        return(
                        <div className="flex justify-center bg-gray-100 px-10 rounded">
                            <div key={item.id} className="flex flex-col bg-white mb-1 border rounded">
                                <div className="flex justify-center bg-white text-black px-1 rounded text-2xl">

                                    <MatchInfoForReader
                                        matchPlan={item}
                                        events={events}
                                        locations={locations}
                                        getMatchDisplayStr={getMatchDisplayStr}
                                    />
                                </div>
                                <p  className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                    {/* 開始前なら予定時間との差を表示 */}
                                    {(status === Status.Waiting || status === Status.Preparing) && (
                                        <MatchCountdownForInfo scheduledStartTime={item.scheduledStartTime}/>
                                    )}
                                </p>
                            </div>
                        </div>
                        );
                    })}
                </div>  
        </div>
    )
    }

export default MapInfo;