"use client"
import {
    Event as EventType,
    Location as LocationType,
    MatchPlan as MatchPlanType,
    MatchResult as MatchResultType,
    Status
} from "@prisma/client";
import MatchInfo from "./MatchInfo";
import StatusBadge from "./StatusBadge";
import MatchCountdown from "./MatchCountdown";
import MatchTimer from "@/components/match/MatchTimer";
import DeleteButton from "@/components/dashboard/matchPlan/DeleteButton";
import MatchResult from "@/components/dashboard/matchPlan/MatchResult";

type MatchCardProps = {
    matchPlan: MatchPlanType;
    status: Status;
    events: EventType[] | undefined;
    locations: LocationType[] | undefined;
    matchResults: Record<number, MatchResultType> | undefined;
    matchTimers: Record<number, boolean>;
    getMatchDisplayStr: (teamId: string) => string;
    handleStartTimer: (matchId: number) => void;
    handleStopTimer: (matchId: number) => void;
    handleDeleteMatch: (matchId: number) => Promise<void>;
};

const MatchCard = ({
                       matchPlan,
                       status,
                       events,
                       locations,
                       matchResults,
                       matchTimers,
                       getMatchDisplayStr,
                       handleStartTimer,
                       handleStopTimer,
                       handleDeleteMatch
                   }: MatchCardProps) => {

    return (
        <div className="flex flex-col justify-start items-start bg-gray-200 p-2 rounded mb-2 w-full">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center bg-amber-100">
                    <MatchInfo
                        matchPlan={matchPlan}
                        events={events}
                        locations={locations}
                        getMatchDisplayStr={getMatchDisplayStr}
                    />
                </div>

                <div className="flex items-center">
                    <StatusBadge status={status}/>
                    <DeleteButton
                        matchId={matchPlan.id}
                        onDelete={() => handleDeleteMatch(matchPlan.id)}
                    />
                </div>
            </div>

            {/* 開始前なら予定時間との差を表示 */}
            {(status === Status.Waiting || status === Status.Preparing) && 
                <MatchCountdown scheduledStartTime={matchPlan.scheduledStartTime}/>
            }

            {/* タイマー表示 - Preparing（準備中）またはPlaying（試合中）の場合だけ表示 */}
            {(status === Status.Playing) && 
                <MatchTimer
                    match={matchPlan}
                    
                    onStart={() => handleStartTimer(matchPlan.id)}
                    onStop={() => handleStopTimer(matchPlan.id)}
                />
            }
            

            {/* 試合結果表示 */}
            <MatchResult
                matchPlan={matchPlan}
                matchResults={matchResults}
                getMatchDisplayStr={getMatchDisplayStr}
            />
        </div>
    );
};

export default MatchCard;
