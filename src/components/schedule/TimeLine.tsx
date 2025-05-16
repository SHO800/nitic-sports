"use client"

// 親要素に最大化してくっつく, 開始時間と終了時間を受け取って時間に応じて上から何%かの位置に赤い横棒を引く 
import {useState} from "react";
import {useCurrentTimeContext} from "@/contexts/currentTimeContext";

const TimeLine = ({startTime, endTime}: { startTime: Date | string, endTime: Date | string }) => {
    const {currentTime} = useCurrentTimeContext();
    const [start] = useState<number>(new Date(startTime).getTime());
    const [totalTime] = useState<number>(new Date(endTime).getTime() - new Date(startTime).getTime());

    // 経過時間をパーセンテージに変換
    const time = currentTime.getTime() - start;
    const percent = time / totalTime * 100;


    return (
        <div className="relative w-full h-full">
            <div className="absolute left-0 h-[.1px] w-full bg-red-500 rounded" style={{top: `${percent}%`}}></div>
            {/*<div className="absolute left-0 h-[.1px] w-full bg-red-500 rounded" style={{ top: `0%` }}></div>*/}
            {/* <p>{percent}</p> */}
        </div>
    )
}

export default TimeLine;