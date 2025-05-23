import {type $Enums, type MatchPlan as MatchPlanType, Status,} from "@prisma/client";
import MatchCountdownForReader from "../reader/MatchCountdownForReader";
import MatchInfoOnModal from "./MatchInfoOnModal";
import MatchResultTable from "@/components/common/MatchResultTable";
import {useDataContext} from "@/contexts/dataContext";

type Props = {
    matchPlan: MatchPlanType;
    status: $Enums.Status;
};

const MatchPlanCardOnModal = ({
                                  matchPlan,
                                  status,
                              }: Props) => {
    const {matchResults, events, getMatchDisplayStr, locations} = useDataContext();
    return (
        <div className="flex flex-col min-w-[80vw] max-w-full justify-center">
            <div className="flex flex-col lg:mx-40 px-1 py-2  rounded overflow-auto">
                <div className="flex justify-center  mb-4 px-5 rounded">
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
                                    <div className="relative bg-black h-[0.5px] mx-3 mt-0.5"/>

                                    <div className="flex bg-white text-black px-1 rounded text-2xl justify-center">
                                        <MatchCountdownForReader
                                            scheduledStartTime={matchPlan.scheduledStartTime}
                                        />
                                    </div>
                                </>
                            )}
                            {
                                (matchPlan.status === Status.Completed) && matchResults && events && matchPlan.startedAt && matchPlan.endedAt &&
                                <div className={"w-full h-fit flex flex-col items-center"}>
                                    <MatchResultTable teamIds={matchResults[matchPlan.id].teamIds}
                                                      matchScores={matchResults[matchPlan.id].matchScores}
                                                      winnerTeamId={matchResults[matchPlan.id].winnerTeamId}
                                                      getMatchDisplayStr={getMatchDisplayStr}
                                                      eventIsTimeBased={!!(events.find(event => event.id === matchPlan.eventId)?.isTimeBased)}
                                                      matchTime={new Date(matchPlan.endedAt).getTime() - new Date(matchPlan.startedAt).getTime()}/>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchPlanCardOnModal;
