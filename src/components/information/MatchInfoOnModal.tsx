"use client";

import { useCurrentTime } from "@/hooks/currentTime";
import { judgeDay12String } from "@/utils/judgeDay12";
import type { MatchPlan as MatchPlanType } from "@prisma/client";
import {useEffect, useRef, useState} from "react";
import StatusBadge from "@/components/dashboard/matchPlan/StatusBadge";

type MatchInfoProps = {
	matchPlan: MatchPlanType;
	events: any[] | undefined;
	locations: any[] | undefined;
	getMatchDisplayStr: (teamId: string) => string;
};

const MatchInfoOnModal = ({
	matchPlan,
	events,
	locations,
	getMatchDisplayStr,
}: MatchInfoProps) => {
	const { currentTime } = useCurrentTime();
	const startTimeDate = new Date(matchPlan.scheduledStartTime);
	const startTime = startTimeDate.getTime();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [fontSize, setFontSize] = useState(16);

	type ReceivedMatchPlan = MatchInfoProps & {
		scheduledStartTimeNum: number;
	};

	const JudgedSchedule = judgeDay12String(startTimeDate);

	const ReceivedMatchPlans: ReceivedMatchPlan = {
		matchPlan,
		events,
		locations,
		scheduledStartTimeNum: startTime,
		getMatchDisplayStr,
	};

	const handleResize = () => {
		if (wrapperRef.current) {
			const width = wrapperRef.current.clientWidth;
			const length = wrapperRef.current.textContent?.length || 1;
			const calcedFontSize = Math.floor(width / length);
			// 12以上32以下に制限
			const newFontSize = Math.max(12, Math.min(calcedFontSize, 32));
			setFontSize(newFontSize);
		}
	};

	useEffect(() => {
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [wrapperRef]);
	
	const isPast =
		(matchPlan.status === "Waiting" ||
		matchPlan.status === "Preparing") &&
			ReceivedMatchPlans.scheduledStartTimeNum < currentTime.getTime();

	return (
		<div className="w-full text-black">
			{/* 試合名とステータスバッジ */}
			<div className="flex w-full bg-white text-[17px] justify-between items-center">
				<p className="ml-2">
					<span className={"text-md"}>#{matchPlan.id}</span>
				<span className="text-xl font-bold mx-3">
						{matchPlan.matchName || `#${matchPlan.id}`}
					</span>
				</p>
				<p
					className={`${matchPlan.matchNote?.trim() === "" || matchPlan.matchNote === null ? "" : "bg-amber-500 text-white mx-2 my-0.5 px-1 py-0.5 rounded"}`}
				>
					{matchPlan.matchNote}
				</p>
				<div
					className={`${matchPlan.matchNote?.trim() !== "" || matchPlan.matchNote === null ? "mr-2" : "mr-6"}`}
				>
					<StatusBadge status={matchPlan.status} />
					<p className={"font-bold"}>
						
					{events?.find((event) => event.id === matchPlan.eventId)?.name}
					</p>
				</div>
			</div>

			<div className="relative bg-black h-[0.5px] mx-2" />

			<div
				className={"flex bg-white py-1 justify-center"}
				style={{ fontSize: `${fontSize}px` }}
				ref={wrapperRef}
			>
				{matchPlan.teamIds
					.map((teamId, index) => {
						let result = getMatchDisplayStr(teamId);
						if (result === "") return "";
						if (
							matchPlan.teamNotes[index] &&
							matchPlan.teamNotes[index] !== result
						) {
							result += `(${matchPlan.teamNotes[index]})`;
						}
						return result;
					})
					.join(" vs ")}{" "}
				<br />
			</div>

			<div className="relative bg-black h-[0.5px] mx-2" />

			<div className="flex px-2 bg-white text-[18px] justify-between">
				<div className={`flex ml-1 ${isPast ? "text-red-500" : "text-black"} `}>
					<div className="mr-1.5">{JudgedSchedule}</div>
					<div>
						{new Date(matchPlan.scheduledStartTime).toLocaleString("ja-JP", {
							hour: "2-digit",
							minute: "2-digit",
						})}
						~
					</div>
				</div>
				<div className="mr-1">
					{matchPlan.locationId &&
						locations?.find((location) => location.id === matchPlan.locationId)
							?.name}
				</div>
			</div>
		</div>
	);
};

export default MatchInfoOnModal;
