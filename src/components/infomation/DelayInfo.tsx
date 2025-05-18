import { useDataContext } from "@/contexts/dataContext";
import { useCurrentTime } from "@/hooks/currentTime";
import MatchInfoForReader from "../reader/MatchInfoForReader";

type Props = {
	eventId: number | string;
};

const DelayInfo = ({ eventId }: Props) => {
	const { currentTime } = useCurrentTime();

	const {
		matchPlans,
		events,
		locations,
		// matchResults,
		getMatchDisplayStr,
	} = useDataContext();

	const dateMatchPlans = matchPlans?.map((item) => ({
		...item,
		scheduledStartTime: new Date(item.scheduledStartTime),
	}));

	const filteredItems = dateMatchPlans?.filter(
		(item) =>
			(item.status === "Waiting" || item.status === "Preparing") &&
			item.scheduledStartTime.getTime() < currentTime.getTime(),
	);

	if (typeof eventId === "number") {
		const filteredByEvent = filteredItems?.filter(
			(item) => item.eventId === eventId,
		);

		if (filteredByEvent?.length === 0) {
			return (
				<div className="flex min-w-[94vw] justify-center">
					<div className="flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[80vw] lg:min-w-[30vw] min-h-[30vh] bg-gray-100 rounded overflow-auto">
						{/* <div className="flex justify-center items-center h-full bg-gray-100 px-10 rounded"> */}
						遅延なし！やったね！
						{/* </div> */}
					</div>
				</div>
			);
		}

		return (
			<>
				<div className="flex flex-col min-w-[94vw] justify-center">
					<div className="flex flex-col lg:mx-20 px-1 py-2 h-[50vh] bg-gray-100 rounded overflow-auto">
						{filteredByEvent?.map((item) => {
							return (
								<div className="flex justify-center bg-gray-100 px-10 rounded">
									<div
										key={item.id}
										className=" relative flex flex-col bg-white mb-1 border rounded"
									>
										<div className="flex justify-center w-[70vw] lg:w-[30vw] bg-white text-black px-1 rounded text-2xl">
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
			</>
		);
	}

	if (typeof eventId === "string") {
		if (filteredItems?.length === 0) {
			return (
				<div className="flex min-w-[94vw] justify-center">
					<div className="flex justify-center items-center lg:mx-20 px-1 py-2 min-w-[80vw] lg:min-w-[30vw] min-h-[30vh] bg-gray-100 rounded overflow-auto">
						{/* <div className="flex justify-center items-center h-full bg-gray-100 px-10 rounded"> */}
						遅延なし！やったね！
						{/* </div> */}
					</div>
				</div>
			);
		}

		return (
			<>
				<div className="flex flex-col min-w-[94vw] justify-center">
					<div className="flex flex-col lg:mx-20 px-1 py-2 h-[50vh] bg-gray-100 rounded overflow-auto">
						{filteredItems?.map((item) => {
							return (
								<div className="flex justify-center bg-gray-100 px-10 rounded">
									<div
										key={item.id}
										className=" relative flex flex-col bg-white mb-1 border rounded"
									>
										<div className="flex justify-center w-[70vw] lg:w-[30vw] bg-white text-black px-1 rounded text-2xl">
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
			</>
		);
	}
};

export default DelayInfo;
