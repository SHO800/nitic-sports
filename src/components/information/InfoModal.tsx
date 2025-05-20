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
        <div className="flex fixed inset-0 z-100 w-full  h-screen bg-[rgba(0,0,0,.8)] justify-center items-center" onClick={(e) => {
            e.preventDefault()
            closeModal()
        }}>
                <div className="flex flex-col max-h-[80vh] px-1 pb-4 bg-[rgba(255,255,255,.99)] rounded item-center overflow-auto hidden-scrollbar" onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}>
                    <button
                        onClick={() => closeModal()}
                        className="flex absolute z-50 right-0 mt-1 mr-6 px-2 py-1 bg-red-400 hover:bg-red-300 rounded text-white"
                    >
                        ×
                    </button>
                    {/* <p>映ったよ～嬉泣</p> */}
                    <MatchPlanCardOnMaodal
                        matchPlan={matchPlan}
                        events={events}
                        locations={locations}
                        status={matchPlan.status}
                        getMatchDisplayStr={getMatchDisplayStr}
                    />

                    <div className="relative z-0  mt-1 lg:mx-40 rounded [filter:chroma(color=#d5d5d5);]">
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
    );
};

export default InfoModal;
