import {useData} from "@/hooks/data";
import {Fragment, useEffect, useMemo, useRef, useState} from "react";
import {Event, Location, MatchPlan, Status} from "@prisma/client";
import {judgeDay12String} from "@/utils/judgeDay12";
import MatchInfo from "@/components/dashboard/matchPlan/MatchInfo";
import StatusBadge from "@/components/dashboard/matchPlan/StatusBadge";
import DeleteButton from "@/components/dashboard/matchPlan/DeleteButton";
import MatchCountdown from "@/components/dashboard/matchPlan/MatchCountdown";
import MatchTimer from "@/components/dashboard/MatchTimer";
import MatchResult from "@/components/dashboard/matchPlan/MatchResult";

const MatchesByLocation = ({locationId}: { locationId: string }) => {
    const {matchPlans, locations, events, getMatchDisplayStr, matchResults, mutateMatchPlans} = useData()
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
    const [matchesInLocation, setMatchesInLocation] = useState<MatchPlan[]>([])
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [fontSize, setFontSize] = useState(16);

    const handleResize = () => {
        if (wrapperRef.current) {
            const width = wrapperRef.current.clientWidth;
            const newFontSize = Math.max(16, Math.floor(width / 20)); // Adjust the divisor to control the scaling
            setFontSize(newFontSize);
        }
    }

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [wrapperRef]);

    const eventsById = useMemo(() => {
        if (!events) return {}
        const result: Record<number, Event> = {}
        const eventIds = events.map(event => event.id)
        eventIds.forEach(id => {
            const event = events.find(event => event.id === id)
            if (event) result[id] = event
        })
        return result
    }, [events])


    useEffect(() => {
        if (!locations || !matchPlans) return;
        const location = locations.find(location => location.id.toString() === locationId) ?? null
        if (!location) return;
        setCurrentLocation(location)
        const relatedMatchPlans: MatchPlan[] = matchPlans.filter(matchPlan => matchPlan.locationId === location.id)


        // 開始時刻で並べ替え
        relatedMatchPlans.sort((a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime())
        setMatchesInLocation(relatedMatchPlans)


    }, [locations, locationId])


    // 各試合のタイマー状態を管理
    const [matchTimers, setMatchTimers] = useState<Record<number, boolean>>({});

    // 各試合のステータスを管理（実際のAPIから取得する代わりのローカル状態）
    const [matchStatuses, setMatchStatuses] = useState<Record<number, Status>>({});

    // ステータスを更新する関数
    const updateMatchStatus = async (matchId: number, status: Status) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/match-plan/${matchId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        startedAt: status === Status.Playing ? new Date() : null,
                        endedAt: status === Status.Finished ? new Date() : null,
                        status
                    }),
                },
            );
            if (!response.ok) {
                throw new Error("Failed to update match status");
            }
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
    


    return (
        <div className={"w-full h-full flex flex-col items-center"} style={{fontSize: fontSize + "px"}}
             ref={wrapperRef}>
            <div
                className={"ml-8 pr-8 mt-5 pb-2 w-full text-4xl font-bold border-b-2 [border-image:linear-gradient(to_right,#888,#888_60%,#eee)_1]"}>
                {currentLocation?.name}
            </div>

            <div
                className={"flex flex-col items-center px-4 m-8 space-y-4 w-full overflow-x-scroll overscroll-none"}>
                {matchesInLocation.map(match => {
                    const teamsDisplayNames = match.teamIds.map(teamId => getMatchDisplayStr(teamId))

                    return (
                        // card
                        <div key={"matches-" + match.id}
                             className={"w-full px-4 py-2  border border-gray-500 rounded "}
                        >
                            {/*ヘッダ*/}
                            <div className={"flex flex-row justify-between space-x-4 w-full "}>
                                <p className={"font-bold m-0"}>{match.matchName} <small
                                    className={"text-gray-500 ml-1 font-normal"}>#{match.id}</small></p>
                                <p className={"text-[.9em] mt-auto mb-1 w-fit whitespace-nowrap min-w-16  "}>{eventsById[match.eventId]?.name}</p>
                            </div>

                            {/*開始時間等*/}
                            <p className={"text-[.9em] mt-auto mb-1 mx-auto w-fit whitespace-nowrap min-w-16 text-center "}>
                                {judgeDay12String(match.scheduledStartTime) ?? "Day1"} {new Date(match.scheduledStartTime).toLocaleString("ja-JP", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })} ~
                            </p>

                            {/*対戦チーム等*/}
                            <p className={"flex flex-row justify-center space-x-8 border-y-[2px] border-y-gray-400"}>
                                {teamsDisplayNames.map((teamName, index) => {
                                    return (
                                        <Fragment
                                            key={"location-" + currentLocation + "-" + "match-" + match.id + "-" + index}>
                                            {index !== 0 && <span className={"text-[.8em] mt-auto mb-1"}>vs</span>}
                                            <span>{teamName}</span>
                                        </Fragment>
                                    )
                                })}
                            </p>

                            {/*    操作ボタン*/}
                            <div className={"flex flex-col justify-start"}>
                                <MatchInfo
                                    matchPlan={match}
                                    events={events}
                                    locations={locations}
                                    getMatchDisplayStr={getMatchDisplayStr}
                                />

                                <StatusBadge status={match.status}/>

                                {/* 開始前なら予定時間との差を表示 */}
                                {(status === Status.Waiting || status === Status.Preparing) && (
                                    <MatchCountdown scheduledStartTime={match.scheduledStartTime}/>
                                )}

                                {/* タイマー表示 - Preparing（準備中）またはPlaying（試合中）の場合だけ表示 */}
                                {(status === Status.Preparing || status === Status.Playing) && (
                                    <MatchTimer
                                        matchId={match.id}
                                        status={status}
                                        isRunning={status === Status.Playing}
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
                })}
            </div>
        </div>
    )
}

export default MatchesByLocation;