import { useDataContext } from "@/contexts/dataContext";
import { useState } from "react";
import Bracket from "../common/Bracket";
import EventSwitch from "./EventSwitch";
import {yowaiFont} from "../../../public/fonts/fonts";

const ResultInfo = () => {
	const { matchPlans } = useDataContext();
	const [selectedId, setSelectedId] = useState<number | "all">(1);

	const setId = (id: number | "all") => {
		setSelectedId(id);
	};

	return (
		<>
			<EventSwitch selectedId={selectedId} setSelectedId={setId} isAllDay={true}/>

			<div className="flex justify-center mx-1 lg:mx-20 mb-2 p-1 rounded max-w-full">
				<div className="flex flex-col max-w-full w-full justify-center">
					<div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh]  rounded overflow-auto">
						{matchPlans &&
							matchPlans?.length > 0 &&
							typeof selectedId === "number" && (
								<Bracket eventId={selectedId} matchPlans={matchPlans} />
							)}

						{typeof selectedId === "string" && (
							<div className={"flex h-full justify-center items-center" + yowaiFont.className}>
								競技別の表示のみ対応しております
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ResultInfo;
