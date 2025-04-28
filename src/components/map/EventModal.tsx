import { useData } from "@/hooks/data";

type Props = {
    placeId: number | null;
    isOpen: boolean;
    closeModal: () => void;
}

const EventModal = ({placeId, isOpen, closeModal}:Props) => {
    
    if(!isOpen)return null;

    const {matchPlans} = useData();
    const filteredItems = matchPlans?.filter((item) => item.locationId === placeId)

    return(
        <div onClick={closeModal} className="flex flex-col fixed z-80 w-full h-screen -mt-18 bg-black/30 justify-center items-center">
                <div className="flex flex-col px-1 py-2 h-[75vh] bg-gray-300 rounded overflow-auto">    
                    <div className="flex bg-gray-300 justify-center pb-1 rounded-t">実施予定の試合</div>
                    {filteredItems?.map((item) => (
                        
                        <div className="flex max-h-64 bg-gray-300 px-20 -mt-0.5 rounded">
                            <div key={item.id} className="flex bg-white mb-1 rounded">
                                <p className="flex justify-center bg-white text-black w-24 px-1 rounded text-3xl">
                                    {item.matchName}</p>
                                <p className="flex justify-center bg-white text-black mb-1 px-1 rounded text-3xl">
                                    {item.scheduledStartTime.toString()}</p>
                            </div>
                        </div>
                    ))}
                </div>  
       </div>
    )
    
}

export default EventModal;