"use client";

import {useDataContext} from "@/contexts/dataContext";
import {MatchPlan as MatchPlanType, Status} from "@prisma/client";
import MapZoom from "./MapZoom";
import MatchPlanCardOnModal from "./MatchPlanCardOnModal";
import Bracket from "@/components/common/Bracket";
import MatchResultTable from "@/components/common/MatchResultTable";

type Props = {
    matchPlan: MatchPlanType;
    isOpen: boolean;
    closeModal: () => void;
    fromTournamentTable?: boolean;
    disableModalOpen?: boolean;
    initialIsFinal?: boolean;
    initialType?: "tournament" | "league" | null;
};

const InfoModal = ({
                       matchPlan,
    
                       isOpen,
                       closeModal,
                       fromTournamentTable = false,
                       disableModalOpen = false,
                       initialIsFinal = false,
                       initialType = null,
                   }: Props) => {
    const {matchPlans, getMatchDisplayStr, events, locations} = useDataContext();

    if (!isOpen) return null;

    return (
        <div className="flex fixed inset-0 z-100 w-full  h-screen bg-[rgba(0,0,0,.8)] justify-center items-center"
             onClick={(e) => {
                 e.preventDefault()
                 closeModal()
             }}>
            <div
                className="flex flex-col max-h-[80vh] px-1 pb-4 bg-[rgba(255,255,255,.99)] rounded item-center overflow-auto hidden-scrollbar"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}>
                <button
                    onClick={() => closeModal()}
                    className="flex absolute z-50 right-0 mt-1 mr-6 px-2 py-1 bg-red-400 hover:bg-red-300 rounded text-white"
                >
                    ×
                </button>
                <MatchPlanCardOnModal
                    matchPlan={matchPlan}
                    status={matchPlan.status}
                />
                <div className="relative z-0  mt-1 lg:mx-40 rounded [filter:chroma(color=#d5d5d5);]">
                    <div className="flex justify-center">
                        <MapZoom locationId={matchPlan.locationId}/>
                    </div>
                </div>
                {/* Bracketは常に表示 */}
                {matchPlans && matchPlans.length > 0 && (
                    <div className="max-w-full mt-1 lg:mx-40 rounded shadow-md">
                        <Bracket
                            eventId={matchPlan.eventId}
                            matchPlans={matchPlans}
                            teamIds={matchPlan.teamIds}
                            disableModalOpen={true} // モーダル内の表から再度モーダルを開けないように
                            selectedMatchId={matchPlan.id}
                            initialIsFinal={initialIsFinal}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoModal;
