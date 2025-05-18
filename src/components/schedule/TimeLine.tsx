"use client";

import { useCurrentTimeContext } from "@/contexts/currentTimeContext";
// 親要素に最大化してくっつく, 開始時間と終了時間を受け取って時間に応じて上から何%かの位置に赤い横棒を引く
import { useState } from "react";

const TimeLine = ({
	startTime,
	endTime,
}: { startTime: Date | string; endTime: Date | string }) => {
	const { currentTime } = useCurrentTimeContext();
	const [start] = useState<number>(new Date(startTime).getTime());
	const [totalTime] = useState<number>(
		new Date(endTime).getTime() - new Date(startTime).getTime(),
	);
	
	// 経過時間をパーセンテージに変換
	const time = currentTime.getTime() - start;
	const percent = (time / totalTime) * 100;
	if (percent < 0 || 100 < percent) {
		return null;
	}
	
	return (
		<div className="relative w-full h-full">
			<div
				className="absolute left-[-32px] h-[.1px] w-[calc(100%+64px)] bg-red-500 rounded z-10"
				style={{ top: `${percent}%` }}
			/>
		</div>
	);
};

export default TimeLine;
