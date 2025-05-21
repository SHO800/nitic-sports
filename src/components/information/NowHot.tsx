"use client";

import { useDataContext } from "@/contexts/dataContext";
import { useCurrentTime } from "@/hooks/currentTime";
import { type MatchPlan as MatchPlanType, Status } from "@prisma/client";
import { useState } from "react";
import MatchInfoForReader from "../reader/MatchInfoForReader";

type Props =
	| { eventId: number | string | null; eventIds?: undefined }
	| { eventIds: string; eventId?: undefined };

const NowHot: React.FC<Props> = (props) => {
	const [matchStatuses, _setMatchStatuses] = useState<Record<number, Status>>(
		{},
	);

	const { matchPlans, events, locations, matchResults, getMatchDisplayStr } =
		useDataContext();

	const currentTime = useCurrentTime();

	if (typeof props.eventId === "number") {
		const MatchPlans = matchPlans?.map((item) => ({
			...item,
			scheduledStartTime: new Date(item.scheduledStartTime),
			scheduledEndTime: new Date(item.scheduledEndTime),
		}));

		const filteredByEvent = MatchPlans?.filter(
			(item) => item.eventId === props.eventId,
		);

		const AddedMatchTime = filteredByEvent?.map((item) => ({
			...item,
			matchTime:
				item.scheduledEndTime.getTime() - item.scheduledStartTime.getTime(),
		}));

		const SortedByStartTime = AddedMatchTime?.sort(
			(a, b) => a.scheduledStartTime.getTime() - b.scheduledStartTime.getTime(),
		);

		const filteredByStatus = SortedByStartTime?.filter(
			(item) =>
				item.status === "Playing"
		);
		// const NowhotThree = filteredByStatus?.slice(0, 3);

		const getMatchStatus = (matchPlan: MatchPlanType): Status => {
			// すでにローカル状態にステータスがある場合はそれを返す
			if (matchStatuses[matchPlan.id] !== undefined) {
				return matchStatuses[matchPlan.id];
			}

			// すでに結果がある場合はCompletedステータス
			if (matchResults?.[matchPlan.id]) {
				return Status.Completed;
			}

			// デフォルトはDBから来るステータスを使用するか、なければPreparingとみなす
			return matchPlan.status || Status.Preparing;
		};

		if (filteredByStatus?.length === 0) {
			return (
				<div className="flex min-w-[94vw] justify-center ">
					<div className="flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[80vw] lg:min-w-[30vw] min-h-[10vh]  rounded overflow-auto ">
						進行中の試合はありません
					</div>
				</div>
			);
		}

		return (
			<div className="flex flex-col min-w-[94vw] justify-center">
				<div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh]  rounded overflow-auto space-y-4">
					{filteredByStatus?.map((item) => {

						return (
							<div key={"nowHotCard-"+item.id} 
								 className="flex justify-center px-10 rounded">
								<div
									className="flex flex-col bg-background mb-1 border-2 rounded "
								>
									<div className="flex justify-center w-[70vw] lg:w-[30vw] bg-background p-1 rounded text-2xl">
										<MatchInfoForReader
											matchPlan={item}
											events={events}
											locations={locations}
											getMatchDisplayStr={getMatchDisplayStr}
										/>
									</div>
                               
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	if (typeof props.eventId === "string") {
		const MatchPlans = matchPlans?.map((item) => ({
			...item,
			scheduledStartTime: new Date(item.scheduledStartTime),
			scheduledEndTime: new Date(item.scheduledEndTime),
		}));

		const AddedMatchTime = MatchPlans?.map((item) => ({
			...item,
			matchTime:
				item.scheduledEndTime.getTime() - item.scheduledStartTime.getTime(),
		}));

		const SortedByStartTime = AddedMatchTime?.sort(
			(a, b) => a.scheduledStartTime.getTime() - b.scheduledStartTime.getTime(),
		);

		const filteredByStatus = SortedByStartTime?.filter(
			(item) =>
				item.status === "Playing"
		);

		// 本番用

		if (filteredByStatus?.length === 0) {
			return (
				<div className="flex min-w-[94vw] justify-center">
					<div className="flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[80vw] lg:min-w-[30vw] min-h-[10vh]  rounded overflow-auto ">
						進行中の試合はありません
					</div>
				</div>
			);
		}

		return (
			<div className="flex flex-col min-w-[94vw] justify-center">
				<div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh]  rounded overflow-auto">
					{filteredByStatus?.map((item) => {

						return (
							<div
								key={item.id}
								className="flex justify-center px-10 rounded"
							>
								<div className="flex flex-col bg-background mb-1 border rounded">
									<div className="flex justify-center w-[70vw] lg:w-[30vw] bg-background p-1 rounded">
										<MatchInfoForReader
											matchPlan={item}
											events={events}
											locations={locations}
											getMatchDisplayStr={getMatchDisplayStr}
										/>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
};

export default NowHot;
