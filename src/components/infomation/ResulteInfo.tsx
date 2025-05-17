import { useState } from "react";
import EventSwitch from "./EventSwitch";
import Bracket from "../common/Bracket";
import { useData } from "@/hooks/data";
import {useDataContext} from "@/contexts/dataContext";

const ResultInfo = () => {
    
    const {matchPlans} = useDataContext()
    const[selectedId,setSelectedId] = useState<number | "all">(1);
    
    const setId = (id: number | "all") => {
        setSelectedId(id);
    }

    return(
        <>
        
            <EventSwitch selectedId={selectedId} setSelectedId={setId} />
            
            <div className="flex justify-center bg-blue-200 mx-1 lg:mx-20 mb-2 p-1 rounded">    
                <div className="flex flex-col min-w-[94vw] justify-center">
                    <div className="flex flex-col lg:mx-20 px-1 py-2 min-h-[30vh] bg-gray-100 rounded overflow-auto">
                        {matchPlans && matchPlans?.length > 0 && typeof selectedId === "number" && (
                            <Bracket eventId={selectedId} matchPlans={matchPlans}/>
                        )}

                        {typeof selectedId === "string" && (
                            <div className="flex h-full justify-center items-center">
                                競技別の表示のみ対応しております
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResultInfo;