import { useState } from "react";
import { useData } from "@/hooks/data";
import MatchInfo from "../dashboard/matchPlan/MatchInfo";
import { Status, MatchPlan as MatchPlanType } from "@prisma/client";
import MatchCountdownForInfo from "./MatchCountdownForInfo";

type Props =
    | {eventId: number | null; eventIds?: undefined}
    | {eventIds: string; eventId?: undefined};

const NowHot: React.FC<Props> = (props) => {

    const [matchStatuses, setMatchStatuses] = useState<Record<number, Status>>({});
        
    const {
        matchPlans,
        events,
        locations,
        matchResults,
        getMatchDisplayStr
    } = useData();

    if(props.eventId){
    const filteredItems = matchPlans?.filter((item) => item.eventId === props.eventId)
    const NowhotThree = filteredItems?.slice(0,3);

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

    return(
        <div className="flex flex-col min-w-[96vw] justify-center">
                <div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                    {NowhotThree?.map((item) => {
                        
                        const status = getMatchStatus(item);

                        return(
                        <div className="flex justify-center bg-gray-100 px-10 rounded">
                            <div key={item.id} className="flex flex-col bg-white mb-1 border rounded">
                                <div className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                    
                                    <MatchInfo
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

    if(props.eventIds){
    const NowhotThree = matchPlans?.slice(0,3);

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

    return(
        <div className="flex flex-col min-w-[96vw] justify-center">
                <div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                    {NowhotThree?.map((item) => {
                        
                        const status = getMatchStatus(item);

                        return(
                        <div className="flex justify-center bg-gray-100 px-10 rounded">
                            <div key={item.id} className="flex flex-col bg-white mb-1 border rounded">
                                <div className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                    
                                    <MatchInfo
                                        matchPlan={item}
                                        events={events}
                                        locations={locations}
                                        getMatchDisplayStr={getMatchDisplayStr}
                                    />
                                </div>
                                <p  className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                    {/* 開始前なら予定時間との差を表示 */}
                                    {(status === Status.Waiting || status === Status.Preparing) && (
                                        <MatchCountdownForInfo scheduledStartTime={item.scheduledStartTime} />
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

}

export default NowHot;