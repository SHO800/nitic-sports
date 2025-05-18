"use client";

import DelayInfo from "@/components/information/DelayInfo";
import EventSwitch from "@/components/information/EventSwitch";
import NextMatch from "@/components/information/NextMatch";
import NowHot from "@/components/information/NowHot";
import ResultInfo from "@/components/information/ResulteInfo";
import {memo, useState} from "react";

const Information = () => {
    const [selectedNowId, setSelectedNowId] = useState<number | "all">(1);
    const [selectedNextId, setSelectedNextId] = useState<number | "all">(1);
    const [selectedDelayId, setSelectedDelayId] = useState<number | "all">(1);

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

                <div>
                    <h1 className="flex justify-center mx-2 my-1 bg-amber-500 rounded">
                        <p className="text-6xl text-white ">NOW HOT!!</p>
                    </h1>
                    

                    <EventSwitch selectedId={selectedNowId} setSelectedId={setNowId} />

                    <div className="flex justify-center  mx-1 lg:mx-20 mb-2 p-1 rounded">
                        <NowHot eventId={selectedNowId} />
                    </div>
                </div>

                <div>
                    <div className="flex justify-center mx-2 mb-1 bg-amber-500 rounded">
                        <p className="text-4xl text-white ">NEXT MATCH!!</p>
                    </div>

                    <EventSwitch selectedId={selectedNextId} setSelectedId={setNextId} />

                    <div className="flex justify-center  mx-1 lg:mx-20 mb-2 p-1 rounded">
                        <NextMatch eventId={selectedNextId} />
                    </div>
                </div>

                <div>
                    <div className="flex justify-center mx-2 mb-1 bg-red-500 rounded">
                        <p className="text-4xl text-white ">遅延情報</p>
                    </div>

                    <EventSwitch
                        selectedId={selectedDelayId}
                        setSelectedId={setDelayId}
                    />

                    <div className="flex justify-center  mx-1 lg:mx-20 mb-2 p-1 rounded">
                        <DelayInfo eventId={selectedDelayId} />
                    </div>
                </div>

                <div>
                    <div className="flex justify-center mx-2 mb-1 bg-lime-600 rounded">
                        <p className="text-4xl text-white ">対戦表 試合結果</p>
                    </div>
                    <ResultInfo />
                </div>
            </div>
        </>
    );
};

export default memo(Information);
