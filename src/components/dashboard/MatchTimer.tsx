"use client"
import {useEffect, useState} from 'react';
import {MatchPlan, Status} from "@prisma/client";
import {useCurrentTime} from "@/hooks/currenTime";

type MatchTimerProps = {
    match: MatchPlan;
    onStart: () => void;
    onStop: () => void;
};

const MatchTimer = ({match, onStart, onStop}: MatchTimerProps) => {
    const {addCallBack, removeCallBack} = useCurrentTime()
    const [elapsedTime, setElapsedTime] = useState<number>(0);


    useEffect(() => {
    
        const updateElapsedTime = () => {
            if (!match.startedAt) return
            console.log("called")
            setElapsedTime(Math.floor(new Date().getTime() - new Date(match.startedAt).getTime()) / 1000);
        };
        
        
        addCallBack(updateElapsedTime)
        return removeCallBack(updateElapsedTime)
    }, [addCallBack, match.startedAt, removeCallBack]);


    // 時間のフォーマット（HH:MM:SS）
    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            remainingSeconds.toString().padStart(2, '0')
        ].join(':');
    };

    return (
        <div className="mt-2 p-2 bg-gray-100 rounded">
            <div className="text-lg font-bold">{formatTime(elapsedTime)}</div>
            <div className="flex mt-2 space-x-2">
                {match.status === Status.Preparing && (
                    <button
                        onClick={onStart}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        開始
                    </button>
                )}
                {match.status === Status.Playing && (
                    <button
                        onClick={onStop}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        終了
                    </button>
                )}
            </div>
        </div>
    );
};

export default MatchTimer;
