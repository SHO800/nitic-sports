import { useDataContext } from "@/contexts/dataContext";
// import MatchInfoForMap from "./MatchInfoForReader";
import type { Status } from "@prisma/client";
import { useState } from "react";
// import MatchCountdownForMap from "./MatchCountdownForMap";
// import MatchTimer from "../dashboard/MatchTimer";
import Modal from "./Modal";

type Props = {
	placeId: number | null;
	isOpen: boolean;
	closeModal: () => void;
};

const EventModal = ({ placeId, isOpen, closeModal }: Props) => {
	if (!isOpen) return null;

	const [_matchStatuses, _setMatchStatuses] = useState<Record<number, Status>>(
		{},
	);

	const {
		// matchPlans,
		// events,
		// locations,
		matchResults,
		// getMatchDisplayStr
	} = useDataContext();

	return (
		<div className="flex flex-col fixed inset-0 z-80 w-full  h-screen bg-black/30 justify-center items-center" onClick={(e) => {
			e.preventDefault()
			closeModal()
		}}>
			<div className="flex flex-col lg:w-[60vw] px-1 pb-4 bg-background rounded" onClick={(e) => {
				e.preventDefault()
				e.stopPropagation()
			}}>
				<button
					onClick={closeModal}
					className="flex mr-1 ml-auto my-1 px-2 py-1 bg-red-400 hover:bg-red-300 rounded text-white float-right"
				>
					×
				</button>
				{/*
                    <div className="flex bg-gray-300 justify-center pb-1 rounded-t">実施予定の試合</div>
                    {filteredItems?.map((item) => {
                        
                        const status = getMatchStatus(item);

                        return(
                        <div className="flex justify-center bg-gray-300 px-10 -mt-0.5 rounded">
                            <div key={item.id} className="flex flex-col bg-white mb-1 rounded">
                                <p className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                    <MatchInfoForMap
                                        matchPlan={item}
                                        events={events}
                                        locations={locations}
                                        getMatchDisplayStr={getMatchDisplayStr}
                                    />
                                </p>
                                <p  className="flex justify-center bg-white text-black px-1 rounded text-2xl">
                                    {(status === Status.Waiting || status === Status.Preparing) && (
                                        <MatchCountdownForMap scheduledStartTime={item.scheduledStartTime} />
                                    )}
                                </p>
                            </div>
                        </div>
                        );
                    })}
                */}

				<Modal placeId={placeId} />
			</div>
		</div>
	);
};

export default EventModal;
