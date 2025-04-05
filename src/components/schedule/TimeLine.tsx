"use client"

// 親要素に最大化してくっつく, 開始時間と終了時間を受け取って時間に応じて上から何%かの位置に赤い横棒を引く 
import {useEffect, useState} from "react";

const TimeLine = ({startTime, endTime}: { startTime: Date | string, endTime: Date | string }) => {

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const totalTime = end - start;


    const [percent, setPercent] = useState(0);

    // 1秒までの誤差を修正する処理
    useEffect(() => {
        const tmpTime = new Date().getSeconds()
        let interval: NodeJS.Timeout;
        new Promise<void>((resolve) => {
            interval = setInterval(() => {
                const newSeconds = new Date().getSeconds()
                if (tmpTime !== newSeconds){
                    clearInterval(interval);
                    resolve();
                }
            }, 10);
        }).then(() => {
            interval = setInterval(() => {
                
                // 処理本編
                const now = new Date().getTime();
                const time = now - start;
                setPercent(time / totalTime * 100);
                
            }, 1000);
        });

        return () => {
            clearInterval(interval);
        };
    }, [start, totalTime]);

    return (
        <div className="relative w-full h-full">
            <div className="absolute left-0 h-[.1px] w-full bg-red-500 rounded" style={{top: `${percent}%`}}></div>
            {/*<div className="absolute left-0 h-[.1px] w-full bg-red-500 rounded" style={{ top: `0%` }}></div>*/}
            <p>{percent}</p>
        </div>
    )
}

export default TimeLine;