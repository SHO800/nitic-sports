import { useState } from "react";
import { useData } from "@/hooks/data";
import MatchInfoForReader from "../reader/MatchInfoForReader";
import { Status, MatchPlan as MatchPlanType } from "@prisma/client";
import MatchCountdownForReader from "../reader/MatchCountdownForReader";

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

        if(NowhotThree?.length === 0){
            return(
                <div className="flex flex-col min-w-[94vw] justify-center">
                    <div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                        <div className="flex justify-center items-center h-full bg-gray-100 px-10 rounded">
                        本日の営業は終了いたしました
                        </div>
                    </div>
                </div>         
            )
        }

        return(
            <div className="flex flex-col min-w-[94vw] justify-center">
                <div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                    {NowhotThree?.map((item) => {
                        
                        const status = getMatchStatus(item);

                        return(
                        <div className="flex justify-center bg-gray-100 px-10 rounded">
                            <div key={item.id} className="flex flex-col bg-white mb-1 border rounded">
                                <div className="flex justify-center w-[60vw] lg:w-[30vw] bg-white text-black px-1 rounded text-2xl">
                                    
                                    <MatchInfoForReader
                                        matchPlan={item}
                                        events={events}
                                        locations={locations}
                                        getMatchDisplayStr={getMatchDisplayStr}
                                    />
                                </div>
                                {/*
                                <p  className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                    {(status === Status.Waiting || status === Status.Preparing) && (
                                        <MatchCountdownForReader scheduledStartTime={item.scheduledStartTime}/>
                                    )}
                                </p>
                                */}
                            </div>
                        </div>
                        );
                    })}
                </div>  
            </div>
        )
    }

    if(props.eventIds){

        const MatchPrans = matchPlans?.map((item) => ({
            ...item,
            scheduledStartTime: new Date(item.scheduledStartTime),
        }));

        const SortedByStartTime = MatchPrans?.sort((a,b) => a.scheduledStartTime.getTime() - b.scheduledStartTime.getTime())    
        
        const NowhotThree = SortedByStartTime?.slice(0,3);

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

        if(NowhotThree?.length === 0){
            return(
                <div className="flex min-w-[94vw] justify-center">
                    <div className="flex lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                        <div className="flex justify-center bg-gray-100 px-10 rounded">
                        本日の営業は終了いたしました
                        </div>
                    </div>
                </div>         
            )
        }

        return(
            <div className="flex flex-col min-w-[94vw] justify-center">
                    <div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                        {NowhotThree?.map((item) => {
                            
                            const status = getMatchStatus(item);

                            return(
                            <div className="flex justify-center bg-gray-100 px-10 rounded">
                                <div key={item.id} className="flex flex-col bg-white mb-1 border rounded">
                                    <div className="flex justify-center w-[60vw] lg:w-[30vw] bg-white text-black px-1 rounded text-2xl">
                                        
                                        <MatchInfoForReader
                                            matchPlan={item}
                                            events={events}
                                            locations={locations}
                                            getMatchDisplayStr={getMatchDisplayStr}
                                        />
                                    </div>
                                    {/*
                                    <p  className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                        {(status === Status.Waiting || status === Status.Preparing) && (
                                            <MatchCountdownForReader scheduledStartTime={item.scheduledStartTime} />
                                        )}
                                    </p>
                                    */}
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