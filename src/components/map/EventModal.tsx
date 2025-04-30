import { useState } from "react";
import { useData } from "@/hooks/data";
import MatchInfoForMap from "./MatchInfoForMap";
import { Status, MatchPlan as MatchPlanType } from "@prisma/client";
import MatchCountdownForMap from "./MatchCountdownForMap";
import MatchTimer from "../dashboard/MatchTimer";

type Props = {
    placeId: number | null;
    isOpen: boolean;
    closeModal: () => void;
}

const EventModal = ({placeId, isOpen, closeModal}:Props) => {
    
    if(!isOpen)return null;

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

    return(
        <div onClick={closeModal} className="flex flex-col fixed z-80 w-full h-screen -mt-18 bg-black/30 justify-center items-center">
                <div className="flex flex-col px-1 py-2 h-[75vh] bg-gray-300 rounded overflow-auto">    
                    <div className="flex bg-gray-300 justify-center pb-1 rounded-t">実施予定の試合</div>
                    {filteredItems?.map((item) => {
                        
                        const status = getMatchStatus(item);

                        return(
                        <div className="flex justify-center bg-gray-300 px-10 -mt-0.5 rounded">
                            <div key={item.id} className="flex flex-col bg-white mb-1 rounded">
                                <p className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                    <MatchInfoForMap
                                        matchPlan={item}
                                        events={events}
                                        locations={locations}
                                        getMatchDisplayStr={getMatchDisplayStr}
                                    />
                                </p>
                                <p  className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                    {/* 開始前なら予定時間との差を表示 */}
                                    {(status === Status.Waiting || status === Status.Preparing) && (
                                        <MatchCountdownForMap scheduledStartTime={item.scheduledStartTime} />
                                    )}

                                    {/*
                                    {(status === Status.Preparing || status === Status.Playing) && (
                                        <MatchTimer 
                                            matchId={item.id}
                                            status={status}
                                            isRunning={status === Status.Playing}
                                            onStart={() => null}
                                            onStop={() => null}
                                        />
                                    )}
                                    */}
                                </p>
                            </div>
                        </div>
                        );
                    })}
                </div>  
       </div>
    )
    
}

export default EventModal;