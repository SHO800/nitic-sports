import { useState } from "react";
import { useData } from "@/hooks/data";
import MatchInfoForReader from "../reader/MatchInfoForReader";
import { Status, MatchPlan as MatchPlanType } from "@prisma/client";
import MatchCountdownForReader from "../reader/MatchCountdownForReader";
import { useCurrentTime } from "@/hooks/currenTime";

type Props =
    | {eventId: number | string | null; eventIds?: undefined}
    | {eventIds: string; eventId?: undefined};

const NextMatch: React.FC<Props> = (props) => {

    const [matchStatuses, setMatchStatuses] = useState<Record<number, Status>>({});
    
    const {
        matchPlans,
        events,
        locations,
        matchResults,
        getMatchDisplayStr
    } = useData();

    const currentTime = useCurrentTime();

    if(typeof props.eventId === "number"){

        const MatchPlans = matchPlans?.map((item) => ({
            ...item,
            scheduledStartTime: new Date(item.scheduledStartTime),
            scheduledEndTime: new Date(item.scheduledEndTime),
        }));


        const filteredByEvent = MatchPlans?.filter((item) => item.eventId === props.eventId)


        const AddedMatchTime = filteredByEvent?.map((item) => ({
            ...item,
            matchTime: (item.scheduledEndTime.getTime() - item.scheduledStartTime.getTime()),
        }));

        const SortedByStartTime = AddedMatchTime?.sort((a,b) => a.scheduledStartTime.getTime() - b.scheduledStartTime.getTime())    
        
        const filteredByStatus = SortedByStartTime?.filter((item) =>
            (item.status === "Preparing" || item.status === "Waiting") 
        // && item.scheduledStartTime.getTime() < currentTime.currentTime
        )
        const NextThree = filteredByStatus?.slice(0,3);

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

        if(NextThree?.length === 0){
            return(
                <div className="flex min-w-[94vw] justify-center">
                    <div className="flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[80vw] lg:min-w-[30vw] min-h-[30vh] bg-gray-100 rounded overflow-auto">
                        {/* <div className="flex justify-center items-center h-full bg-gray-500 px-10 rounded"> */}
                            全試合終了しました
                        {/* </div> */}
                    </div>
                </div>         
            )
        }

        return(
            <div className="flex flex-col min-w-[94vw] justify-center">
                <div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                    {NextThree?.map((item) => {
                        
                        const status = getMatchStatus(item);

                        return(
                        <div className="flex justify-center bg-gray-100 px-10 rounded">
                            <div key={item.id} className="flex flex-col bg-white mb-1 border rounded">
                                <div className="flex justify-center w-[70vw] lg:w-[30vw] bg-white px-1 rounded text-2xl">
                                    
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

    if(typeof props.eventId === "string"){

        const MatchPlans = matchPlans?.map((item) => ({
            ...item,
            scheduledStartTime: new Date(item.scheduledStartTime),
            scheduledEndTime: new Date(item.scheduledEndTime),
        }));

        const AddedMatchTime = MatchPlans?.map((item) => ({
            ...item,
            matchTime: (item.scheduledEndTime.getTime() - item.scheduledStartTime.getTime()),
        }));


        const SortedByStartTime = AddedMatchTime?.sort((a,b) => a.scheduledStartTime.getTime() - b.scheduledStartTime.getTime())    
        
        const filteredByStatus = SortedByStartTime?.filter((item) =>
            (item.status === "Preparing" || item.status === "Waiting")
        //  && item.scheduledStartTime.getTime() > currentTime.currentTime
        )
        const NextThree = filteredByStatus?.slice(0,3);

        {/*
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
        */}

        if(NextThree?.length === 0){
            return(
                <div className="flex min-w-[94vw] justify-center">
                    <div className="flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[80vw] lg:min-w-[30vw] min-h-[30vh] bg-gray-100 rounded overflow-auto">
                        {/* <div className="flex justify-center items-center bg-gray-100 px-10 rounded"> */}
                            全試合終了しました
                        {/* </div> */}
                    </div>
                </div>
            )
        }

        return(
            <div className="flex flex-col min-w-[94vw] justify-center">
                    <div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                        {NextThree?.map((item) => {
                            
                            // const status = getMatchStatus(item);

                            return(
                            <div key={item.id} className="flex justify-center bg-gray-100 px-10 rounded">
                                <div className="flex flex-col bg-white mb-1 border rounded">
                                    <div className="flex justify-center w-[70vw] lg:w-[30vw] bg-white px-1 rounded">
                                        
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

export default NextMatch;