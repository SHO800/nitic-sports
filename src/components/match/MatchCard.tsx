import StatusBadge from "@/components/dashboard/matchPlan/StatusBadge";
import {judgeDay12String} from "@/utils/judgeDay12";
import {Event, MatchPlan, MatchResult as MatchResultType, Prisma, Status} from "@prisma/client";
import MatchCountdown from "@/components/dashboard/matchPlan/MatchCountdown";
import MatchTimer from "@/components/match/MatchTimer";
import MatchResult from "@/components/dashboard/matchPlan/MatchResult";
import {useData} from "@/hooks/data";
import CardBorder from "@/components/match/CardBorder";
import MatchTeams from "@/components/match/MatchTeams";
import MatchController from "@/components/match/MatchController";
import {useDataContext} from "@/contexts/dataContext";

interface MatchCardProps {
    match: MatchPlan,
    eventsById: Record<number, Event>,
    matchResults?: { [key: string]: MatchResultType },
}

const MatchCard = ({match, eventsById, matchResults}: MatchCardProps) => {

    const {getMatchDisplayStr} = useDataContext()
    const teamsDisplayNames = match.teamIds.map(teamId => getMatchDisplayStr(teamId))
    const event = eventsById[match.eventId]
    if (!event) {
        return null
    }
    return (
        // card
        <CardBorder status={match.status} scheduledStartTime={match.scheduledStartTime}>
            <div className={"flex flex-row justify-between "}>
                <StatusBadge status={match.status}/>
                {/*開始時間等*/}
                <p className={"text-[1.25em] mr-2 w-fit whitespace-nowrap min-w-16 text-center "}>
                    <span className={"text-[.8em] mr-1"}>{judgeDay12String(match.scheduledStartTime) ?? "Day1"}</span>
                    {new Date(match.scheduledStartTime).toLocaleString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })} ~
                </p>
            </div>

            {/*試合名と種目名*/}
            <div className={"flex flex-row justify-between space-x-4 w-full my-1 mx-auto mt-2 "}>
                <p className={"text-[1.1em] mt-auto mb-1 w-fit whitespace-nowrap min-w-16  "}>{event.name}</p>
                <p className={"font-bold m-0"}>{match.matchName} <small
                    className={"text-gray-500 ml-1 font-normal"}>#{match.id}</small></p>
            </div>


            {/*対戦チーム等*/}
            <MatchTeams teamNames={teamsDisplayNames}/>

            <div className={"text-[1.1em] my-1  mx-auto w-fit whitespace-nowrap min-w-16 text-center "}>
                {/* 開始前なら予定時間との差を表示 */}
                {(match.status === Status.Waiting || match.status === Status.Preparing) &&
                    <MatchCountdown scheduledStartTime={match.scheduledStartTime}/>
                }
            </div>

            {/*    操作ボタン*/}
            <div className={"flex flex-col justify-start items-center "}>
                {match.status === Status.Playing && (
                    <p className={"text-[1.2em]"}>
                        <MatchTimer match={match}/>
                    </p>
                )}

                {/* タイマー表示 - Preparing（準備中）またはPlaying（試合中）の場合だけ表示 */}
                {(match.status === Status.Preparing || match.status === Status.Playing) && (
                    <MatchController match={match}/>
                )}
            </div>

            {/* 試合結果表示 */}
            {(match.status === Status.Finished || match.status === Status.Completed) &&
                <MatchResult
                    matchPlan={match}
                    matchResults={matchResults}
                    event={event}
                    getMatchDisplayStr={getMatchDisplayStr}
                />}
        </CardBorder>
    )
}

export default MatchCard;