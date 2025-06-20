import { useDataContext } from "@/contexts/dataContext";
import { type MatchPlan as MatchPlanType, Status } from "@prisma/client";
import { useState } from "react";
import MatchInfoForReader from "../reader/MatchInfoForReader";
import localFont from "next/font/local";
import {yowaiFont} from "../../../public/fonts/fonts";

type Props =
	| { eventId: number | string | null; eventIds?: undefined }
	| { eventIds: string; eventId?: undefined };


const NextMatch: React.FC<Props> = (props) => {
	const [matchStatuses] = useState<Record<number, Status>>({});

	const { matchPlans, events, locations, matchResults, getMatchDisplayStr } =
		useDataContext();

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
			(item) => item.status === "Preparing" || item.status === "Waiting",
			// && item.scheduledStartTime.getTime() < currentTime.currentTime
		);
		const NextThree = filteredByStatus?.slice(0, 3);

		const _getMatchStatus = (matchPlan: MatchPlanType): Status => {
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

		if (NextThree?.length === 0) {
			return (
				<div className="flex min-w-[94vw] justify-center">
					<div className={"flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[80vw] lg:min-w-[30vw] min-h-[10vh] rounded overflow-auto " + yowaiFont.className}>
						全試合終了しました
					</div>
				</div>
			);
		}

		return (
			<div className="flex flex-col min-w-[94vw] justify-center">
				<div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh]  rounded overflow-auto space-y-4">
					{NextThree?.map((item) => {
						return (
							<div key={"nextMatchCard-"+item.id} className="flex justify-center  px-10 rounded">
								<div
									className="flex flex-col bg-white mb-1 border rounded "
								>
									<div className="flex justify-center w-[70vw] lg:w-[30vw] bg-white p-1 rounded text-2xl">
										<MatchInfoForReader
											matchPlan={item}
											events={events}
											locations={locations}
											getMatchDisplayStr={getMatchDisplayStr}
										/>
									</div>
									{/*
                                <p  className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                    {(status === Status.Waiting || status === Status.Preparing) && (
                                        <MatchCountdownForReader scheduledStartTime={item.scheduledStartTime}/>
                                    )}
                                </p>
                                */}
								</div>
							</div>
						);
					})}
				</div>
				<p className={"ml-auto mr-8 text-gray-600"}>直近3件以内を表示中</p>
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
			(item) => item.status === "Preparing" || item.status === "Waiting",
			//  && item.scheduledStartTime.getTime() > currentTime.currentTime
		);
		const NextThree = filteredByStatus?.slice(0, 3);

		if (NextThree?.length === 0) {
			return (
				<div className="flex min-w-[94vw] justify-center">
					<div className={"flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[80vw] lg:min-w-[30vw] min-h-[10vh]  rounded overflow-auto "  + yowaiFont.className}>
						全試合終了しました
					</div>
				</div>
			);
		}

		return (
			<div className="flex flex-col min-w-[94vw] justify-center">
				<div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh]  rounded overflow-auto space-y-4">
					{NextThree?.map((item) => {
						// const status = getMatchStatus(item);

						return (
							<div
								key={item.id}
								className="flex justify-center  px-10 rounded"
							>
								<div className="flex flex-col bg-white mb-1 border-2 rounded ">
									<div className="flex justify-center w-[70vw] lg:w-[30vw] bg-white p-1 rounded ">
										<MatchInfoForReader
											matchPlan={item}
											events={events}
											locations={locations}
											getMatchDisplayStr={getMatchDisplayStr}
										/>
									</div>
									{/*
                                    <p  className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                        {(status === Status.Waiting || status === Status.Preparing) && (
                                            <MatchCountdownForReader scheduledStartTime={item.scheduledStartTime} />
                                        )}
                                    </p>
                                    */}
								</div>
							</div>
						);
					})}
				</div>
				<p className={"ml-auto mr-8 text-gray-600"}>直近3件以内を表示中</p>
			</div>
		);
	}
};

export default NextMatch;
