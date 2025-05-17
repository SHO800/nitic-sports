"use client"
import {useCallback, useEffect, useRef, useState} from "react";

export const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date(0));
    const callBacksRef = useRef<((currentTime: Date) => void)[]>([]);
    const plusTime = parseInt(process.env.NEXT_PUBLIC_PLUS_TIME ?? "0");

    // コールバックを呼び出す関数
    const callCallBacks = useCallback((time: Date) => {
        if (callBacksRef.current.length > 0) {
            callBacksRef.current.forEach(callback => {
                callback(time);
            });
        }
    }, []);

    // 1秒ごとの更新処理
    useEffect(() => {
        let interval: NodeJS.Timeout;

        // 最初の秒の変わり目まで待機する処理
        const syncToSecond = () => {
            const now = new Date();
            const ms = now.getMilliseconds();
            // 次の秒の開始までの待機時間を計算
            const delay = 1000 - ms;

            // 次の秒の開始時に実行
            return setTimeout(() => {
                // 現在時刻を設定（必要に応じて調整）
                const newTime = plusTime ? new Date(new Date().getTime() + plusTime) : new Date();
                setCurrentTime(newTime);
                callCallBacks(newTime);

                // 正確に1秒ごとにタイマーを設定
                interval = setInterval(() => {
                    const updatedTime = plusTime ? new Date(new Date().getTime() + plusTime) : new Date();
                    setCurrentTime(updatedTime);
                    callCallBacks(updatedTime);
                }, 1000);
            }, delay);
        };

        const initialTimeout = syncToSecond();

        return () => {
            clearTimeout(initialTimeout);
            if (interval) clearInterval(interval);
        };
    }, [callCallBacks, plusTime]);

    const addCallBack = useCallback((callback: (currentTime: Date) => void) => {
        if (!callback || callBacksRef.current.includes(callback)) return;
        callBacksRef.current.push(callback);
        // 登録時に一度実行して初期状態を設定
        callback(currentTime);
    }, [currentTime])

    const removeCallBack = useCallback((callback: (currentTime: Date) => void) => {
        if (!callback || !callBacksRef.current.includes(callback)) return;
        callBacksRef.current = callBacksRef.current.filter(cb => cb !== callback);
    }, [])

    // 時間1と時間2の差を計算して日時分秒で表示する関数
    const formatTimeDifference = useCallback((targetTime: Date | string) => {
        // targetTimeをDateオブジェクトに変換
        if (typeof targetTime === 'string') {
            targetTime = new Date(targetTime);
        } else if (!(targetTime instanceof Date)) {
            throw new Error('Invalid targetTime type. Expected Date or string.');
        }

        let isPast = false;

        // 現在の時間を取得
        let diff = targetTime.getTime() - currentTime.getTime();
        if (diff < 0) {
            isPast = true;
            diff = currentTime.getTime() - targetTime.getTime();
        }


        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);


        const daysStr = Math.abs(diff) > 86400000 ? `${days}日` : '';
        const hoursStr = Math.abs(diff) > 3600000 ? `${hours}時間` : '';
        const minutesStr = Math.abs(diff) > 60000 ? `${minutes}分` : '';

        // もしdiffが0~-180秒の間は遅延なしで残り0秒と返す
        if (isPast && diff < 180000) {
            return {
                str: '0秒',
                diff: diff,
                isPast: false,
                waiting: true,
            }
        }

        return {
            str: `${daysStr}${hoursStr}${minutesStr}${seconds}秒`,
            diff: diff,
            isPast,
            waiting: false,
        }
    }, [currentTime]);


    return {
        addCallBack,
        removeCallBack,
        currentTime,
        formatTimeDifference,
    }
}