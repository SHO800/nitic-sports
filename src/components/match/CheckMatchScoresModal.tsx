import {useState} from "react";
import {useData} from "@/hooks/data";
import {Event} from "@prisma/client";

const CheckMatchScoresModal = ({unSettledEvents}: {unSettledEvents: Event[]}) => {
    const {matchResults, scores} = useData()
    
    const [isOpen, setIsOpen] = useState<boolean>(false)
    

    return (
        <>
            <ModalTab isOpen={isOpen} setIsOpen={setIsOpen}/>
            <div
                className={`fixed w-screen h-screen top-0 overflow-hidden ${isOpen ? "block" : "hidden"} py-18 bg-[rgba(0,0,0,.5)] z-20 border-gray-400 border-2`}
                onClick={() => setIsOpen(false)}
            >
                <div className="flex flex-col items-center justify-center w-[calc(100%-12em)] h-[calc(100%-12em)] m-24  bg-white">
                    {unSettledEvents.map(event => (
                        <ModalEventContainer key={"scoreSetModal-"+event.id} unsettledEvent={event} />
                    ))}
                    
                </div>

            </div>
        </>
    )
}


const ModalTab = ({isOpen, setIsOpen}: { isOpen: boolean, setIsOpen: (value: boolean) => void }) => {

    return (
        <div
            className={`${isOpen ? "-right-full" : "right-0"} fixed top-18 h-28 w-7  border-l-4 border-t-4 border-b-4 rounded-l-md border-gray-500  bg-white`}
            onClick={() => setIsOpen(!isOpen)}
        >
            種目順位
            <div className={"absolute animate-ping bg-blue-400 h-3 w-3 -left-2 -top-2 rounded-full "} />
            <div className={"absolute  bg-blue-600 h-3 w-3 -left-2 -top-2 rounded-full"} />
                
        </div>
    )
}


export default CheckMatchScoresModal;

const ModalEventContainer = ({unsettledEvent}: {unsettledEvent: Event}) => {
    
    return (
        <div className={""}>
            {unsettledEvent.name}
        </div>
    )
}