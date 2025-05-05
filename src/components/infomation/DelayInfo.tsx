// import { useState } from "react";
import { useData } from "@/hooks/data";
// import MatchCountdownForReader from "../reader/MatchCountdownForReader";
// import { Status, MatchPlan as MatchPlanType } from "@prisma/client";
import { useCurrentTime } from "@/hooks/currenTime";
import MatchInfoForReader from "../reader/MatchInfoForReader";
import { Dispatch, useState } from "react";
import InfoModal from "./InfoModal";
import { MatchPlan } from "@prisma/client";

{/*
type Props = {
    setMatchPlan:any,
    setEvents:any,
    setLocations:any,
    setGetMatchDisplayStr:any,
    isOpen: boolean,
    OpenModal: () => void;
}
*/}

const DelayInfo = () => {

    // const [matchStatuses, setMatchStatuses] = useState<Record<number, Status>>({});
    // const {formatTimeDifference} = useCurrentTime();
    const {currentTime} = useCurrentTime();
    const [isOpen, setIsOpen] = useState(false);

    const {
        matchPlans,
        events,
        locations,
        // matchResults,
        getMatchDisplayStr
    } = useData();

    const CloseModal = () => setIsOpen(false);

    const dateMatchPlans = matchPlans?.map((item) => ({
            ...item,
            scheduledStartTime: new Date(item.scheduledStartTime),
        }));
    
    const numStartMatchPlans = dateMatchPlans?.map((item) => ({
            ...item,
            scheduledStartTime: item.scheduledStartTime.getTime(),
        }));
    
    const filteredItems = numStartMatchPlans?.filter((item) => item.status === "Waiting" || item.status === "Preparing" && item.scheduledStartTime < currentTime)

    const filteredMatchPrans = filteredItems?.map((item) => ({
            ...item,
            scheduledStartTime: new Date(item.scheduledStartTime),
        }));

    {/*
    const clickHandle = (matchPlan:any, event: any, location: any, getMatchDisplayStr:any) =>{
        setMatchPlan(matchPlan);
        setEvents(event);
        setLocations(location);
        setGetMatchDisplayStr(getMatchDisplayStr);
    }
    */}

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
    }
    */}

    if(filteredMatchPrans?.length === 0){
        return(
            <div className="flex flex-col min-w-[94vw] justify-center">
                <div className="flex lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                    <div className="flex justify-center items-center h-full bg-gray-100 px-10 rounded">
                    遅延なし！やったね！
                    </div>
                </div>
            </div>         
        )
    }

    return(
        <>

            <div className="flex flex-col min-w-[94vw] justify-center">
                    <div className="flex flex-col lg:mx-20 px-1 py-2 h-[50vh] bg-gray-100 rounded overflow-auto">
                        {filteredMatchPrans?.map((item) => {
                            
                            return(
                            <div className="flex justify-center bg-gray-100 px-10 rounded">
                                <div key={item.id} className=" relative flex flex-col bg-white mb-1 border rounded">
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
        </>
    )

}

export default DelayInfo;