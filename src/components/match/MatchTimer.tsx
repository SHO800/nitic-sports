"use client"
import {useEffect, useMemo, useState} from 'react';
import {MatchPlan} from "@prisma/client";
import {useCurrentTimeContext} from "@/contexts/currentTimeContext";

const MatchTimer = ({match}: { match: MatchPlan }) => {
    const {addCallBack, removeCallBack} = useCurrentTimeContext();
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    const startTime = useMemo(() => match.startedAt && new Date(match.startedAt).getTime(), [match.startedAt])

    useEffect(() => {
        const updateElapsedTime = (currentTime: Date) => {
            if (!startTime) return
            setElapsedTime(currentTime.getTime() - startTime);
        };
        addCallBack(updateElapsedTime)
        return () => {
            removeCallBack(updateElapsedTime)
        }

    }, [addCallBack, removeCallBack, startTime]);


    // 時間のフォーマット（HH:MM:SS）
    return useMemo(() => {
        const days = Math.floor(elapsedTime / 86400000);
        const hours = Math.floor((elapsedTime % 86400000) / 3600000);
        const minutes = Math.floor((elapsedTime % 3600000) / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);


        const daysStr = Math.abs(elapsedTime) > 86400000 ? `${days} : ` : '';
        const hoursStr = Math.abs(elapsedTime) > 3600000 ? `${hours.toString().padStart(2, '0')} : ` : '';
        const minutesStr = Math.abs(elapsedTime) > 60000 ? `${minutes.toString().padStart(2, '0')} : ` : '00 : ';
        const secondsStr = `${seconds.toString().padStart(2, '0')}`;

        return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`;
    }, [elapsedTime]);
};

export default MatchTimer;
