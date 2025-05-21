"use client";
import {deleteMatchPlan, updateMatchPlanStatus} from "@/app/actions/data";
import {useDataContext} from "@/contexts/dataContext";
import {Event, type MatchPlan as MatchPlanType, Status} from "@prisma/client";
import {useState} from "react";
import MatchCard from "@/components/match/MatchCard";

const MatchPlan = () => {
    const {
        matchPlans,
        matchResults,
        events,
        mutateMatchData,
    } = useDataContext();

    // 各試合のタイマー状態を管理
    const [_matchTimers, setMatchTimers] = useState<Record<number, boolean>>({});

    // 各試合のステータスを管理（実際のAPIから取得する代わりのローカル状態）
    const [matchStatuses, setMatchStatuses] = useState<Record<number, Status>>(
        {},
    );

    // ステータスを更新する関数
    const updateMatchStatus = async (matchId: number, status: Status) => {
        try {
            await updateMatchPlanStatus(
                matchId,
                status,
                status === Status.Playing ? new Date() : undefined,
                status === Status.Finished ? new Date() : undefined,
            );
            await mutateMatchData();
            // ローカルの状態を更新
            setMatchStatuses((prev) => ({
                ...prev,
                [matchId]: status,
            }));

            // タイマーが開始・停止したことを記録
            if (status === Status.Playing) {
                setMatchTimers((prev) => ({
                    ...prev,
                    [matchId]: true,
                }));
            } else if (status === Status.Finished) {
                setMatchTimers((prev) => ({
                    ...prev,
                    [matchId]: false,
                }));
            }
        } catch (error) {
            console.error("ステータス更新エラー:", error);
        }
    };

    // タイマーの開始（Playing状態に移行）
    const _handleStartTimer = (matchId: number) => {
        updateMatchStatus(matchId, Status.Playing);
    };
    // タイマーの停止（Finished状態に移行）
    const _handleStopTimer = (matchId: number) => {
        updateMatchStatus(matchId, Status.Finished);
    };

    // 試合のステータスを取得
    const getMatchStatus = (matchPlan: MatchPlanType): Status => {
        // すでにローカル状態にステータスがある場合はそれを返す
        if (matchStatuses[matchPlan.id] !== undefined) {
            return matchStatuses[matchPlan.id];
        }

        // すでに結果がある場合はCompletedステータス
        if (matchResults?.[matchPlan.id]) {
            return Status.Completed;
        }

        // デフォルトはDBから来るステータスを使用するか、なければPreparingとみなす
        return matchPlan.status || Status.Preparing;
    };

    // 試合削除処理
    const handleDeleteMatch = async (matchId: number) => {
        try {
            await deleteMatchPlan(matchId);
            await mutateMatchData();
        } catch (error) {
            console.error("試合削除エラー:", error);
        }
    };

    return (
        <div className={"flex flex-row  flex-wrap justify-center space-x-8 space-y-8"}>
            {events &&
                matchPlans?.map((matchPlan) => {
                    const status = getMatchStatus(matchPlan);
                    const eventsById: Record<number, Event> = {};
                    events.forEach((event) => {
                        eventsById[event.id] = event;
                    });

                    return (
                        <div className={"w-96"} key={matchPlan.id}>

                            <MatchCard
                                match={matchPlan}
                                eventsById={eventsById}
                                canChangeState={false}
                                // status={status}
                                // events={events}
                                // locations={locations}
                                matchResults={matchResults}
                                // getMatchDisplayStr={getMatchDisplayStr}
                                // handleDeleteMatch={handleDeleteMatch}
                            />
                        </div>
                    );
                })}
            {/*<AddMatchPlanForm/>*/}
        </div>
    );
};

export default MatchPlan;
