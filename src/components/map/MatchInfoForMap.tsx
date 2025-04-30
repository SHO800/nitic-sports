"use client"
import { MatchPlan as MatchPlanType } from "@prisma/client";

type MatchInfoProps = {
    matchPlan: MatchPlanType;
    events: any[] | undefined;
    locations: any[] | undefined;
    getMatchDisplayStr: (teamId: string) => string;
};

const MatchInfoForMap = ({ matchPlan, events, locations, getMatchDisplayStr }: MatchInfoProps) => {
    return (
        <p className="text-black">
            {
                events?.find((event) => event.id === matchPlan.eventId)?.name
            } | <br/> {
                matchPlan.teamIds.map((teamId, index) => {
                    let result = getMatchDisplayStr(teamId)
                    if (result === "") return ""
                    if (matchPlan.teamNotes[index]) {
                        result += `(${matchPlan.teamNotes[index]})`
                    }
                    return result
                }).join(" vs ")
            } | <br/>{
                new Date(matchPlan.scheduledStartTime).toLocaleString('ja-JP', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                })
            } ~ {
                new Date(matchPlan.scheduledEndTime).toLocaleString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            } | {
                matchPlan.locationId && locations?.find((location) => location.id === matchPlan.locationId)?.name
            }
        </p>
    );
};

export default MatchInfoForMap;
