import {useState} from "react";
import {useData} from "@/hooks/data";
import MatchInfoTest from "../reader/MatchInfoForReader";
import {MatchPlan as MatchPlanType, Status} from "@prisma/client";
import {useCurrentTimeContext} from "@/contexts/currentTimeContext";

const DelayInfo = () => {

    const [matchStatuses, setMatchStatuses] = useState<Record<number, Status>>({});
    // const {formatTimeDifference} = useCurrentTimeContext();
    const {currentTime} = useCurrentTimeContext();

    const {
        matchPlans,
        events,
        locations,
        matchResults,
        getMatchDisplayStr
    } = useData();

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

    if (filteredMatchPrans?.length === 0) {
        return (
            <div className="flex flex-col min-w-[94vw] justify-center">
                <div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                    <div className="flex justify-center items-center h-full bg-gray-100 px-10 rounded">
                        遅延なし！やったね！
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-w-[94vw] justify-center">
            <div className="flex flex-col lg:mx-20 px-1 py-2 h-[50vh] bg-gray-100 rounded overflow-auto">
                {filteredMatchPrans?.map((item) => {

                    return (
                        <div className="flex justify-center bg-gray-100 px-10 rounded">
                            <div key={item.id} className="flex flex-col bg-white mb-1 border rounded">
                                <div
                                    className="flex justify-center min-w-[60vw] bg-white text-black px-1 rounded text-2xl">

                                    <MatchInfoTest
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

export default DelayInfo;