import {useCallback, useEffect, useState} from "react";

export const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date().getTime());

    // 1秒までの誤差を修正する処理
    useEffect(() => {
        const tmpTime = new Date().getSeconds()
        let interval: NodeJS.Timeout;
        new Promise<void>((resolve) => {
            interval = setInterval(() => {
                const newSeconds = new Date().getSeconds()
                if (tmpTime !== newSeconds) {
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        }).then(() => {
            interval = setInterval(() => {
                setCurrentTime(new Date().getTime() + 86400000*33 + 3600000*-7 + 60000*21 + 1000*30);

                // 処理本編
                // const now = new Date().getTime();
                // const time = now - start;
                // setPercent(time / totalTime * 100);

            }, 1000);
        });

        return () => {
            clearInterval(interval);
        };
    }, []);

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
        let diff = targetTime.getTime() - currentTime;
        if (diff < 0) {
            isPast = true;
            diff =  currentTime - targetTime.getTime();
        }
        
        
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        
        const daysStr = Math.abs(diff) > 86400000 ? `${days}日` : '';
        const hoursStr = Math.abs(diff) > 3600000 ? `${hours}時間` : '';
        const minutesStr = Math.abs(diff) > 60000 ? `${minutes}分` : '';
        
        // もしdiffが0~-60秒の間は遅延なしで残り0秒と返す
        if (isPast && diff < 60000) {
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
        currentTime,
        formatTimeDifference,
    }
}