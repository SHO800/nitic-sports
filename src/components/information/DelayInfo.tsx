import {useDataContext} from "@/contexts/dataContext";
import {useCurrentTime} from "@/hooks/currentTime";
import MatchInfoForReader from "../reader/MatchInfoForReader";

type Props = {
    eventId: number | string;
};

const DelayInfo = ({eventId}: Props) => {
    const {currentTime} = useCurrentTime();

    const {
        matchPlans,
        events,
        locations,
        // matchResults,
        getMatchDisplayStr,
    } = useDataContext();

    const dateMatchPlans = matchPlans?.map((item) => ({
        ...item,
        scheduledStartTime: new Date(item.scheduledStartTime),
    }));

    const filteredItems = dateMatchPlans?.filter(
        (item) =>
            (item.status === "Waiting" || item.status === "Preparing") &&
            item.scheduledStartTime.getTime() < currentTime.getTime(),
    );

    if (typeof eventId === "number") {
        const filteredByEvent = filteredItems?.filter(
            (item) => item.eventId === eventId,
        );

        if (filteredByEvent?.length === 0) {
            return (
                <div className="flex min-w-[94vw] justify-center">
                    <div
                        className={"flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[80vw] lg:min-w-[30vw] min-h-[10vh] rounded overflow-auto　"}>
                        遅延なし！やったね！
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="flex flex-col min-w-[94vw] justify-center">
                    <div className="flex flex-col lg:mx-20 px-1 py-2 h-[50vh]  rounded overflow-auto space-y-4">
                        {filteredByEvent?.map((item) => {
                            return (
                                <div key={"delayInfoCard-" + item.id}
                                     className="flex justify-center  px-10 rounded">
                                    <div

                                        className=" relative flex flex-col bg-white mb-1 border rounded"
                                    >
                                        <div
                                            className="flex justify-center w-[70vw] lg:w-[30vw] bg-white text-black px-1 rounded text-2xl">
                                            <MatchInfoForReader
                                                matchPlan={item}
                                                events={events}
                                                locations={locations}
                                                getMatchDisplayStr={getMatchDisplayStr}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className={"ml-auto mr-8 text-gray-600"}>直近3件以内を表示中</p>
                </div>
            </>
        );
    }

    if (typeof eventId === "string") {
        if (filteredItems?.length === 0) {
            return (
                <div className="flex min-w-[94vw] justify-center">
                    <div
                        className={"flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[80vw] lg:min-w-[30vw] min-h-[10vh] rounded overflow-auto  "}>
                        遅延なし！やったね！
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className="flex flex-col min-w-[94vw] justify-center">
                    <div className="flex flex-col lg:mx-20 px-1 py-2 h-[50vh]  rounded overflow-auto space-y-4">
                        {filteredItems?.map((item) => {
                            return (
                                <div key={item.id} className="flex justify-center  px-10 rounded">
                                    <div

                                        className=" relative flex flex-col bg-white mb-1 border-2 rounded"
                                    >
                                        <div
                                            className="flex justify-center w-[70vw] lg:w-[30vw] bg-white text-black p-1 rounded text-2xl">
                                            <MatchInfoForReader
                                                matchPlan={item}
                                                events={events}
                                                locations={locations}
                                                getMatchDisplayStr={getMatchDisplayStr}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
};

export default DelayInfo;
