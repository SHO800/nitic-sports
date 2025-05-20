"use client";

import DelayInfo from "@/components/information/DelayInfo";
import EventSwitch from "@/components/information/EventSwitch";
import NextMatch from "@/components/information/NextMatch";
import NowHot from "@/components/information/NowHot";
import ResultInfo from "@/components/information/ResulteInfo";
import {memo, useState} from "react";

const Information = () => {
    const [selectedNowId, setSelectedNowId] = useState<number | "all">("all");
    const [selectedNextId, setSelectedNextId] = useState<number | "all">("all");
    const [selectedDelayId, setSelectedDelayId] = useState<number | "all">("all");

    const setNowId = (id: number | "all") => {
        setSelectedNowId(id);
    };

    const setNextId = (id: number | "all") => {
        setSelectedNextId(id);
    };

    const setDelayId = (id: number | "all") => {
        setSelectedDelayId(id);
    };

    return (
        <>
            {/* <div className="fixed z-100 w-full h-screen bg-black/30">null</div> */}
            
            <div className="min-h-screen">
                {/* <InfoModal /> */}
                
                <div className={"mt-16 border-green-400 border-2 rounded m-6"}>
                    <h1 className="relative flex justify-center mx-2 my-1 rounded h-8 bg-background">
                        <p className="absolute -top-8 text-3xl text-black bg-background px-4 tracking-wider">進行中の試合</p>
                        <p className="absolute -top-0 text-lg text-black bg-background px-4 tracking-widest">NOW HOT!!</p>
                    </h1>
                    
                    
                    <EventSwitch selectedId={selectedNowId} setSelectedId={setNowId}/>

                    <div className="flex justify-center  mx-1 lg:mx-20 mb-2 p-1 rounded">
                        <NowHot eventId={selectedNowId}/>
                    </div>
                </div>


                <div className={"mt-14 border-blue-500 border-2 rounded m-6"}>
                    <h1 className="relative flex justify-center mx-2 my-1 rounded h-8 bg-background">
                        <p className="absolute -top-8 text-3xl text-black bg-background px-4 tracking-wider">次の試合</p>
                        <p className="absolute -top-0 text-lg text-black bg-background px-4 tracking-widest">NEXT MATCH!!</p>
                    </h1>
                    
                    <EventSwitch selectedId={selectedNextId} setSelectedId={setNextId}/>
                    
                    <div className="flex justify-center  mx-1 lg:mx-20 mb-2 p-1 rounded">
                        <NextMatch eventId={selectedNextId}/>
                    </div>
                </div>

                <div className={"mt-14 border-red-500 border-2 rounded m-6"}>
                    <h1 className="relative flex justify-center mx-2 my-1 rounded h-8 bg-background">
                        <p className="absolute -top-8 text-3xl text-black bg-background px-4 tracking-wider">遅延情報</p>
                        <p className="absolute -top-0 text-lg text-black bg-background px-4 tracking-widest">DELAYING!!</p>
                    </h1>
                    
                    <EventSwitch
                        selectedId={selectedDelayId}
                        setSelectedId={setDelayId}
                    />

                    <div className="flex justify-center  mx-1 lg:mx-20 mb-2 p-1 rounded">
                        <DelayInfo eventId={selectedDelayId}/>
                    </div>
                </div>

                <div className={"mt-14 border-black border-2 rounded m-6"}>
                    <h1 className="relative flex justify-center mx-2 my-1 rounded h-8 bg-background">
                        <p className="absolute -top-8 text-3xl text-black bg-background px-4 tracking-wider">対戦表</p>
                        <p className="absolute -top-0 text-lg text-black bg-background px-4 tracking-widest">+ 試合結果</p>
                    </h1>
                    <ResultInfo/>
                </div>
            </div>
        </>
    );
};

export default memo(Information);
