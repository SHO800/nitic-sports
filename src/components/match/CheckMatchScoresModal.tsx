import {useState} from "react";
import {useData} from "@/hooks/data";

const CheckMatchScoresModal = ({}: {}) => {
    const {matchResults} = useData()
    


    const [isOpen, setIsOpen] = useState<boolean>(false)


    return (
        <>
            <ModalTab isOpen={isOpen} setIsOpen={setIsOpen}/>
            <div
                className={`fixed w-screen h-screen top-0 overflow-hidden ${isOpen ? "block" : "hidden"} py-18 bg-black opacity-50 z-20`}
            >
                <p>{}</p>

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