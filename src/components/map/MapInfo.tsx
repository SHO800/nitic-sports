import { useDataContext } from "@/contexts/dataContext";
import MatchInfoForReader from "../reader/MatchInfoForReader";
import localFont from "next/font/local";
import {yowaiFont} from "../../../public/fonts/fonts";

type Props = { placeId: number | null };

const MapInfo = ({ placeId }: Props) => {
	// const [matchStatuses, setMatchStatuses] = useState<Record<number, Status>>({});

	const {
		matchPlans,
		events,
		locations,
		// matchResults,
		getMatchDisplayStr,
	} = useDataContext();

	const filteredItems = matchPlans?.filter(
		(item) => item.locationId === placeId,
	);
	const filteredByStatus = filteredItems?.filter(
		(item) =>
			item.status === "Waiting" ||
			item.status === "Preparing" ||
			item.status === "Playing",
	);

	if (filteredByStatus?.length === 0) {
		return (
			<div className="flex flex-col min-w-[94vw] lg:min-w-[58vw] justify-center">
				<div className="flex lg:mx-20 px-1 py-2 min-h-[30vh]  rounded overflow-auto">
					<div className={"flex justify-center items-center w-full h-full  rounded overflow-auto  " + yowaiFont.className}>
						全試合終了しました
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col min-w-[94vw] lg:min-w-[58vw] justify-center">
			<div className="flex flex-col lg:mx-20 px-1 py-2 h-[50vh] min-h-[30vh]  rounded overflow-auto">
				{filteredByStatus?.map((item) => {
					// const status = getMatchStatus(item);

					return (
						<div key={item.id} className="flex justify-center  px-10 rounded">
							<div
								className="flex flex-col bg-background w-[70vw] lg:w-[30vw] mb-1 border rounded"
							>
								<div className="flex justify-center bg-background px-1 rounded">
									<MatchInfoForReader
										matchPlan={item}
										events={events}
										locations={locations}
										getMatchDisplayStr={getMatchDisplayStr}
									/>
								</div>
								{/*
                                <p  className="flex justify-center bg-background text-black px-1 rounded text-2xl">
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
		</div>
	);
};

export default MapInfo;
