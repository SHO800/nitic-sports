"use client"
import { useState, useEffect } from 'react';
import {Status} from "@prisma/client";

type MatchTimerProps = {
  matchId: number;
  status: Status;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
};

const MatchTimer = ({ matchId, status, isRunning, onStart, onStop }: MatchTimerProps) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      // タイマーが開始されたら、開始時間を設定
      if (startTime === null) {
        setStartTime(Date.now());
      }
      
      // 1秒ごとに経過時間を更新
      interval = setInterval(() => {
        if (startTime !== null) {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

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
        {status === Status.Preparing && (
          <button
            onClick={onStart}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            開始
          </button>
        )}
        {status === Status.Playing && (
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
