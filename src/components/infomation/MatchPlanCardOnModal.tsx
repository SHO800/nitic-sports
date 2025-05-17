import {useState} from "react";
import MatchCountdownForReader from "../reader/MatchCountdownForReader";
import {$Enums, MatchPlan as MatchPlanType, Status} from "@prisma/client";
// import { useCurrentTime } from "@/hooks/currentTime";
import MatchInfoOnModal from "./MatchInfoOnModal";
import {useDataContext} from "@/contexts/dataContext";

type Props = {
    matchPlan: MatchPlanType;
    events: any[] | undefined;
    locations: any[] | undefined;
    status: $Enums.Status;
    getMatchDisplayStr: (teamId: string) => string;
}

const MatchPlanCardOnMaodal = ({matchPlan, events, locations, status, getMatchDisplayStr}: Props) => {

    const [matchStatuses, setMatchStatuses] = useState<Record<number, Status>>({});
    // const {formatTimeDifference} = useCurrentTime();
    // const {currentTime} = useCurrentTime();

    const {
        matchPlans,
        matchResults,
    } = useDataContext()


    {/*
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
    */
    }

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

    {/*
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
    */
    }

    return (
        <div className="flex flex-col min-w-[80vw] max-w-full justify-center">
            <div className="flex flex-col lg:mx-40 px-1 py-2 bg-gray-100 rounded overflow-auto">
                <div className="flex justify-center bg-gray-100 mb-4 px-5 rounded">
                    <div className="flex flex-col">
                        <p className="font-bold mb-2">試合情報</p>
                        <div className="flex flex-col bg-white w-[70vw] lg:w-[30vw] mb-1 border rounded ">
                            <div className="flex justify-center bg-white px-1 rounded">

                                <MatchInfoOnModal
                                    matchPlan={matchPlan}
                                    events={events}
                                    locations={locations}
                                    getMatchDisplayStr={getMatchDisplayStr}
                                />
                            </div>

                            {(status === Status.Waiting || status === Status.Preparing) && (
                                <>
                                    <div className="relative bg-black h-[0.5px] mx-3 mt-0.5"></div>

                                    <p className="flex bg-white text-black px-1 rounded text-2xl justify-center">
                                        <MatchCountdownForReader scheduledStartTime={matchPlan.scheduledStartTime}/>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default MatchPlanCardOnMaodal;