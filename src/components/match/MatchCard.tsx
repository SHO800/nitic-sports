import {useCurrentTime} from "@/hooks/currenTime";
import StatusBadge from "@/components/dashboard/matchPlan/StatusBadge";
import {Fragment, useMemo, useState} from "react";
import {judgeDay12String} from "@/utils/judgeDay12";
import {Location, MatchPlan, MatchResult as MatchResultType, Prisma, Status} from "@prisma/client";
import MatchCountdown from "@/components/dashboard/matchPlan/MatchCountdown";
import MatchTimer from "@/components/dashboard/MatchTimer";
import MatchResult from "@/components/dashboard/matchPlan/MatchResult";
import {useData} from "@/hooks/data";
import {updateMatchPlanStatus} from "@/app/actions/data";
import JsonValue = Prisma.JsonValue;

interface MatchCardProps {
    match: MatchPlan,
    location: Location,
    eventsById: Record<number, {
        name: string
        id: number
        description: string | null
        teamData: JsonValue[]
    }>,
    matchResults?: { [key: string]: MatchResultType },
}

const MatchCard = ({match, location, eventsById, matchResults}: MatchCardProps) => {

    const {getMatchDisplayStr, mutateMatchPlans} = useData()

    const teamsDisplayNames = match.teamIds.map(teamId => getMatchDisplayStr(teamId))

    const {formatTimeDifference} = useCurrentTime();
    const {isPast, waiting} = formatTimeDifference(match.scheduledStartTime)

    // 各試合のタイマー状態を管理
    const [matchTimers, setMatchTimers] = useState<Record<number, boolean>>({});

    // 各試合のステータスを管理（実際のAPIから取得する代わりのローカル状態）
    const [matchStatuses, setMatchStatuses] = useState<Record<number, Status>>({});

    // ステータスを更新する関数
    const updateMatchStatus = async (matchId: number, status: Status) => {
        try {
            await updateMatchPlanStatus(
                matchId,
                status,
                status === Status.Playing ? new Date() : undefined,
                status === Status.Finished ? new Date() : undefined
            )
            await mutateMatchPlans();


            // ローカルの状態を更新
            setMatchStatuses(prev => ({
                ...prev,
                [matchId]: status
            }));

            // タイマーが開始・停止したことを記録
            if (status === Status.Playing) {
                setMatchTimers(prev => ({
                    ...prev,
                    [matchId]: true
                }));
            } else if (status === Status.Finished) {
                setMatchTimers(prev => ({
                    ...prev,
                    [matchId]: false
                }));
            }
        } catch (error) {
            console.error("ステータス更新エラー:", error);
        }
    }


    // タイマーの開始（Playing状態に移行）
    const handleStartTimer = (matchId: number) => {
        updateMatchStatus(matchId, Status.Playing);
    };
    // タイマーの停止（Finished状態に移行）
    const handleStopTimer = (matchId: number) => {
        updateMatchStatus(matchId, Status.Finished);
    };

    // 試合のステータスを取得
    const getMatchStatus = (matchPlan: MatchPlan): Status => {
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

    const frameClass = useMemo(() => {
        if (match.status === Status.Waiting || match.status === Status.Preparing) {
            if (isPast) {
                if (waiting) {
                    return "card-warn"
                } else {
                    return "card-danger"
                }
            }
        } else if (match.status === Status.Playing) {
            return "card-progress"
        } else if (match.status === Status.Finished) {
            return "card-finished "
        } else if (match.status === Status.Completed || match.status === Status.Cancelled) {
            return "card-completed"
        }
        return ""
    }, [isPast, match.status, waiting])

    return (
        // card
        <div
            className={
                "w-full  px-4 py-2 outline-2 outline-offset-4 outline-gray-400 rounded-xs " + frameClass
            }
        >
            <div className={"flex flex-row justify-center "}><StatusBadge status={match.status}/></div>
            
            {/*試合名と種目名*/}
            <div className={"flex flex-row justify-between space-x-4 w-full "}>
                <p className={"font-bold m-0"}>{match.matchName} <small
                    className={"text-gray-500 ml-1 font-normal"}>#{match.id}</small></p>
                <p className={"text-[1.1em] mt-auto mb-1 w-fit whitespace-nowrap min-w-16  "}>{eventsById[match.eventId]?.name}</p>
            </div>


            {/*対戦チーム等*/}
            <p className={"flex flex-row justify-center space-x-8 border-y-[2px] border-y-gray-400"}>
                {teamsDisplayNames.map((teamName, index) => {
                    return (
                        <Fragment
                            key={"location-" + location.id + "-" + "match-" + match.id + "-" + index}>
                            {index !== 0 && <span className={"text-[.8em] mt-auto mb-1"}>vs</span>}
                            <span>{teamName}</span>
                        </Fragment>
                    )
                })}
            </p>
            {/*開始時間等*/}
            <p className={"text-[1em] my-1  mx-auto w-fit whitespace-nowrap min-w-16 text-center "}>
                {judgeDay12String(match.scheduledStartTime) ?? "Day1"} {new Date(match.scheduledStartTime).toLocaleString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })} ~
            </p>
            <div className={"text-[1.1em] my-1  mx-auto w-fit whitespace-nowrap min-w-16 text-center "}>
                {/* 開始前なら予定時間との差を表示 */}
                {(match.status === Status.Waiting || match.status === Status.Preparing) &&
                    <MatchCountdown scheduledStartTime={match.scheduledStartTime}/>
                }
            </div>

            {/*    操作ボタン*/}
            <div className={"flex flex-col justify-start"}>

                {/* タイマー表示 - Preparing（準備中）またはPlaying（試合中）の場合だけ表示 */}
                {(match.status === Status.Preparing || match.status === Status.Playing) && (
                    <MatchTimer
                        match={match}
                        onStart={() => handleStartTimer(match.id)}
                        onStop={() => handleStopTimer(match.id)}
                    />
                )}

                {/* 試合結果表示 */}
                <MatchResult
                    matchPlan={match}
                    matchResults={matchResults}
                    getMatchDisplayStr={getMatchDisplayStr}
                />
            </div>
        </div>
    )
}

export default MatchCard;