"use client"
import { MatchPlan as MatchPlanType } from "@prisma/client";
import { useCurrentTime } from "@/hooks/currenTime";

type MatchInfoProps = {
    matchPlan: MatchPlanType;
    events: any[] | undefined;
    locations: any[] | undefined;
    getMatchDisplayStr: (teamId: string) => string;
};

const MatchInfoForReader = ({ matchPlan, events, locations, getMatchDisplayStr }: MatchInfoProps) => {
    const {currentTime} = useCurrentTime();
    const startTimeDate = new Date(matchPlan.scheduledStartTime);
    const startTime = startTimeDate.getTime();


    type ReservedMatchPlan = MatchInfoProps & {
        scheduledStartTimeNum: number;
    }

    const ReservedMatchPlans: ReservedMatchPlan ={
            matchPlan,
            events,
            locations,
            scheduledStartTimeNum: startTime,
            getMatchDisplayStr,
        };

    const isPast = matchPlan.status === "Waiting" || matchPlan.status === "Preparing" && ReservedMatchPlans.scheduledStartTimeNum < currentTime
    
    return (
        <div className="w-full text-black">
            <div className="flex w-full bg-white text-[20px] justify-between items-center">
                <p className="ml-2">{matchPlan.id}</p>
                <p className={`${(matchPlan.matchNote?.trim() === "" || matchPlan.matchNote === null) ? "" : "bg-amber-500 text-white mx-2 my-0.5 px-1 py-0.5 rounded"}`}>{matchPlan.matchNote}</p>
                <p className={`${(matchPlan.matchNote?.trim() !== "" || matchPlan.matchNote === null) ? "mr-2" : "mr-6"}`}>{events?.find((event) => event.id === matchPlan.eventId)?.name}</p>
            </div>
            
            <div className="relative bg-black h-[0.5px] mx-2"></div>
            
            <div className="flex bg-white text-4xl justify-center">
                {
                    matchPlan.teamIds.map((teamId, index) => {
                        let result = getMatchDisplayStr(teamId)
                        if (result === "") return ""
                        if (matchPlan.teamNotes[index]) {
                            result += `(${matchPlan.teamNotes[index]})`
                        }
                        return result
                    }).join(" vs ")
                } <br/>
            </div>
            
            <div className="relative bg-black h-[0.5px] mx-2"></div>
            
            <div className="flex px-2 bg-white text-[20px] justify-between">
                <div className={`ml-1 ${(isPast) ? "text-red-500" : "text-black"} `}>
                {
                    new Date(matchPlan.scheduledStartTime).toLocaleString('ja-JP', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                }~ 
                </div>
                <div className="mr-1">
                {
                    matchPlan.locationId && locations?.find((location) => location.id === matchPlan.locationId)?.name
                }
                </div>
            </div>
        </div>
    );
};

export default MatchInfoForReader;
