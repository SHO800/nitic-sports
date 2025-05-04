"use client"

import { useState } from "react";
import { useData } from "@/hooks/data";
import NowHot from "@/components/infomation/NowHot";
import DelayInfo from "@/components/infomation/DelayInfo";
import InfoModal from "@/components/infomation/InfoModal";

const Infomation = () => {
    
    const [selectedId, setSelectedId] = useState(1);

    return(
        <>
        {/* <div className="fixed z-100 w-full h-screen bg-black/30">null</div> */}

        <div className="min-h-screen">  

            {/* <InfoModal /> */}
            
            <div>
                <h1 className="flex justify-center mx-2 my-1 bg-amber-500 rounded"><p className="text-6xl text-white animate-pulse">NOW HOT!!</p></h1>

                <div className="flex justify-center bg-blue-300 mx-1 lg:mx-20 mb-2 p-1 rounded">
                        <NowHot eventIds="all"/>
                </div>
            </div>

            
            <div>
                <div className="flex justify-center mx-2 mb-1 bg-amber-500 rounded"><p className="text-4xl text-white animate-pulse">競技別NOW HOT!!</p></div>
                
                <div className="flex flex-row px-1 justify-center">
                    <button onClick={() => setSelectedId(1)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 1 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>バド</button>
                    <button onClick={() => setSelectedId(2)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 2 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>卓球</button>
                    <button onClick={() => setSelectedId(3)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 3 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>バレー</button>
                    <button onClick={() => setSelectedId(4)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 4 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>バスケ</button>
                    <button onClick={() => setSelectedId(5)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 5 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>テニス</button>
                    <button onClick={() => setSelectedId(6)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 6 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>ソフボ</button>
                    <button onClick={() => setSelectedId(7)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 7 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>サッカー</button>
                    <button onClick={() => setSelectedId(8)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 8 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>リレー</button>
                </div>

                <div className="flex justify-center bg-blue-300 mx-1 lg:mx-20 mb-2 p-1 rounded">
                    <NowHot eventId={selectedId} />
                </div>
            </div>
            
            <div>
                <div className="flex justify-center mx-2 mb-1 bg-red-500 rounded"><p className="text-4xl text-white animate-pulse">遅延情報</p></div>
                
                <div className="flex justify-center bg-blue-300 mx-1 lg:mx-20 mb-2 p-1 rounded">
                    <DelayInfo/>
                    
                </div>
            </div>
        </div>
        </>
    )
}

export default Infomation;