"use client";

import {useDataContext} from "@/contexts/dataContext";
import type {MatchPlan as MatchPlanType} from "@prisma/client";
import MapZoom from "./MapZoom";
import MatchPlanCardOnMaodal from "./MatchPlanCardOnModal";
import Bracket from "@/components/common/Bracket";

type Props = {
    matchPlan: MatchPlanType;
    events: any[] | undefined;
    locations: any[] | undefined;
    getMatchDisplayStr: (teamId: string) => string;
    isOpen: boolean;
    closeModal: () => void;
};

const InfoModal = ({
                       matchPlan,
                       events,
                       locations,
                       getMatchDisplayStr,
                       isOpen,
                       closeModal,
                   }: Props) => {
    const {matchPlans} = useDataContext();

    if (!isOpen) return null;

    // const CloseModal = () => isOpen = false;

    return (
        <div className="flex fixed inset-0 z-100 w-full  h-screen bg-black/30 justify-center items-center">
            <div className="relative flex flex-col h-[80vh] px-1 bg-gray-300 rounded item-center">
                <div className="flex flex-col max-h-[80vh] px-1 pb-4 bg-gray-300 rounded item-center overflow-auto">
                    <button
                        onClick={() => closeModal()}
                        className="flex absolute z-50 right-0 mt-1 mr-6 px-2 py-1 bg-red-400 hover:bg-red-300 rounded text-white"
                    >
                        ×
                    </button>
                    <div className="flex mr-1 ml-auto my-1 pr-5 pl-2 py-1 text-gray-300 rounded">
                        a
                    </div>
                    {/* <p>映ったよ～嬉泣</p> */}
                    <MatchPlanCardOnMaodal
                        matchPlan={matchPlan}
                        events={events}
                        locations={locations}
                        status={matchPlan.status}
                        getMatchDisplayStr={getMatchDisplayStr}
                    />

                    <div className="relative z-0 bg-gray-100 mt-1 lg:mx-40 rounded">
                        <div className="flex justify-center">
                            <MapZoom locationId={matchPlan.locationId}/>
                        </div>
                    </div>

                    <div className=" max-w-full mt-1 lg:mx-40 rounded shadow-md">
                        {/* <div className="flex justify-center text-sm">leagueFigure or tournamentFigure ←イマココ!!</div> */}
                        {matchPlans && matchPlans.length > 0 && (
                            <Bracket
                                eventId={matchPlan.eventId}
                                matchPlans={matchPlans}
                                teamIds={matchPlan.teamIds}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
