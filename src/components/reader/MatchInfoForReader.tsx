"use client";

import { useCurrentTime } from "@/hooks/currentTime";
import { judgeDay12String } from "@/utils/judgeDay12";
import type { MatchPlan as MatchPlanType } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";
import InfoModal from "../infomation/InfoModal";

type MatchInfoProps = {
	matchPlan: MatchPlanType;
	events: any[] | undefined;
	locations: any[] | undefined;
	getMatchDisplayStr: (teamId: string) => string;
};

const MatchInfoForReader = ({
	matchPlan,
	events,
	locations,
	getMatchDisplayStr,
}: MatchInfoProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { currentTime } = useCurrentTime();
	const startTimeDate = new Date(matchPlan.scheduledStartTime);
	const startTime = startTimeDate.getTime();

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

	const OpenModal = () => setIsOpen(true);
	const CloseModal = () => setIsOpen(false);

	const isPast =
		matchPlan.status === "Waiting" ||
		(matchPlan.status === "Preparing" &&
			ReceivedMatchPlans.scheduledStartTimeNum < currentTime);

	return (
		<div className="w-full text-black">
			<div
				onClick={() => OpenModal()}
				className="flex w-full bg-white text-[17px] justify-between items-center"
			>
				<p className="ml-2">#{matchPlan.id}</p>
				<p
					className={`${matchPlan.matchNote?.trim() === "" || matchPlan.matchNote === null ? "" : "bg-amber-500 text-white mx-2 my-0.5 px-1 py-0.5 rounded"}`}
				>
					{matchPlan.matchNote}
				</p>
				<p
					className={`${matchPlan.matchNote?.trim() !== "" || matchPlan.matchNote === null ? "mr-2" : "mr-6"}`}
				>
					{events?.find((event) => event.id === matchPlan.eventId)?.name}
				</p>
			</div>

			<div className="relative bg-black h-[0.5px] mx-2" />

			<div
				onClick={() => OpenModal()}
				className={`flex bg-white py-1 justify-center ${matchPlan.teamIds.length > 2 ? "text-2xl" : "text-4xl"}`}
			>
				{matchPlan.teamIds
					.map((teamId, index) => {
						let result = getMatchDisplayStr(teamId);
						if (result === "") return "";
						if (matchPlan.teamNotes[index]) {
							result += `(${matchPlan.teamNotes[index]})`;
						}
						return result;
					})
					.join(" vs ")}{" "}
				<br />
			</div>

			<div className="relative bg-black h-[0.5px] mx-2" />

			<div
				onClick={() => OpenModal()}
				className="flex px-2 bg-white text-[18px] justify-between"
			>
				{/*
                <div className={`flex ml-1 ${(isPast) ? "text-red-500" : "text-black"} `}>
                    <div className="mr-1.5">
                        {JudgedSchedule}
                    </div>
                    
                    <div>
                    {
                        new Date(matchPlan.scheduledStartTime).toLocaleString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                    }~ 
                    </div>
                </div>
                */}
				<div
					className={clsx(
						"flex ml-1",
						isPast ? "text-red-500" : "",
						matchPlan.status === "Playing" ? "text-blue-500" : "",
					)}
				>
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

			<InfoModal
				matchPlan={matchPlan}
				events={events}
				locations={locations}
				getMatchDisplayStr={getMatchDisplayStr}
				isOpen={isOpen}
				closeModal={CloseModal}
			/>
		</div>
	);
};

export default MatchInfoForReader;
