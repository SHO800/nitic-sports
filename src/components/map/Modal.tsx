"use client";

import {memo, useState} from "react";
import MapInfo from "./MapInfo";
// import { Playpen_Sans } from "next/font/google";

type Props = {
    placeId: number | null;
};

const Modal = ({placeId}: Props) => {
    if (placeId === 1) {
        const [selectedId, setSelectedId] = useState(1);

        return (
            <div>
                <div className="">
                    <div className="flex flex-row px-1 justify-center">
                        <button
                            onClick={() => setSelectedId(1)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 1 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            A面
                        </button>
                        <button
                            onClick={() => setSelectedId(2)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 2 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            B面
                        </button>
                        {/* <button onClick={() => setSelectedId(1)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 1 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>A面(バド)</button> */}
                        {/* <button onClick={() => setSelectedId(2)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 2 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>B面(バド)</button> */}
                        <button
                            onClick={() => setSelectedId(3)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 3 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            C面
                        </button>
                        <button
                            onClick={() => setSelectedId(4)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 4 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            D面
                        </button>
                        <button
                            onClick={() => setSelectedId(5)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 5 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            E面
                        </button>
                    </div>

                    <div className="flex justify-center bg-blue-300 h-[58vh] mb-2 p-1 rounded">
                        <MapInfo placeId={selectedId}/>
                    </div>
                </div>
            </div>
        );
    }

    if (placeId === 2) {
        const [selectedId, setSelectedId] = useState(6);

        return (
            <div>
                <div className="">
                    <div className="flex flex-row px-1 justify-center">
                        {/* <button onClick={() => setSelectedId(6)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 6 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}>全面</button> */}
                        <button
                            onClick={() => setSelectedId(6)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 6 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            A面
                        </button>
                        <button
                            onClick={() => setSelectedId(7)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 7 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            B面
                        </button>
                    </div>

                    <div className="flex justify-center bg-blue-300 h-[58vh] mb-2 p-1 rounded">
                        <MapInfo placeId={selectedId}/>
                    </div>
                </div>
            </div>
        );
    }

    if (placeId === 3) {
        const [selectedId, setSelectedId] = useState(13);

        return (
            <div>
                <div className="">
                    <div className="flex flex-row px-1 justify-center">
                        <button
                            onClick={() => setSelectedId(13)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 13 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            A面
                        </button>
                        <button
                            onClick={() => setSelectedId(14)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 14 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            B面
                        </button>
                        <button
                            onClick={() => setSelectedId(15)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 15 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            C面
                        </button>
                        <button
                            onClick={() => setSelectedId(16)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 16 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            D面
                        </button>
                    </div>

                    <div className="flex justify-center bg-blue-300 h-[58vh] mb-2 p-1 rounded">
                        <MapInfo placeId={selectedId}/>
                    </div>
                </div>
            </div>
        );
    }

    if (placeId === 4) {
        const [selectedId, setSelectedId] = useState(9);

        return (
            <div>
                <div className="">
                    <div className="flex flex-row px-1 justify-center">
                        <button
                            onClick={() => setSelectedId(17)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 17 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            全面
                        </button>
                        <button
                            onClick={() => setSelectedId(9)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 9 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            A面
                        </button>
                        <button
                            onClick={() => setSelectedId(10)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 10 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            B面
                        </button>
                    </div>

                    <div className="flex justify-center bg-blue-300 h-[58vh] mb-2 p-1 rounded">
                        <MapInfo placeId={selectedId}/>
                    </div>
                </div>
            </div>
        );
    }

    if (placeId === 5) {
        const [selectedId, setSelectedId] = useState(11);

        return (
            <div>
                <div className="">
                    <div className="flex flex-row px-1 justify-center">
                        <button
                            onClick={() => setSelectedId(11)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 11 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            A面
                        </button>
                        <button
                            onClick={() => setSelectedId(12)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 12 ? "bg-blue-300 text-black" : "bg-blue-400 text-white border-b"}`}
                        >
                            B面
                        </button>
                    </div>

                    <div className="flex justify-center bg-blue-300 h-[58vh] mb-2 p-1 rounded">
                        <MapInfo placeId={selectedId}/>
                    </div>
                </div>
            </div>
        );
    }

    return <div>null</div>;
};

export default memo(Modal);
