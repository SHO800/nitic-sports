"use client";
import {memo, useEffect, useState} from "react";

type Props = {
    selectedId: number | "all";
    setSelectedId: (id: number | "all") => void;
}

const EventSwitch = ({selectedId, setSelectedId}: Props) => {
    const [today, setToday] = useState<number>(0);

    useEffect(() => {
        const currentDate = new Date();
        setToday(currentDate.getDate());
    }, []);


    return (
        <div className="flex flex-row px-1 justify-center">
            {(today <= 22) && (
                <>
                    <button onClick={() => setSelectedId(1)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 1 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>バド
                    </button>
                    {/* <button onClick={() => setSelectedId(2)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 2 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>卓球</button> */}
                    <button onClick={() => setSelectedId(3)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 3 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>バレー
                    </button>
                    {/* <button onClick={() => setSelectedId(4)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 4 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>バスケ</button> */}
                    <button onClick={() => setSelectedId(5)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 5 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>テニス
                    </button>
                    <button onClick={() => setSelectedId(6)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 6 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>ソフト
                    </button>
                    <button onClick={() => setSelectedId(7)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 7 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>サッカー
                    </button>
                    {/* <button onClick={() => setSelectedId(8)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 8 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>リレー</button> */}
                    <button onClick={() => setSelectedId("all")}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === "all" ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>全競技
                    </button>
                </>
            )}
            {(today >= 23) && (
                <>
                    {/* <button onClick={() => setSelectedId(1)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 1 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>バド</button> */}
                    <button onClick={() => setSelectedId(2)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 2 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>卓球
                    </button>
                    {/* <button onClick={() => setSelectedId(3)} className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 3 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>バレー</button> */}
                    <button onClick={() => setSelectedId(4)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 4 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>バスケ
                    </button>
                    <button onClick={() => setSelectedId(5)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 5 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>テニス
                    </button>
                    <button onClick={() => setSelectedId(6)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 6 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>ソフト
                    </button>
                    <button onClick={() => setSelectedId(7)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 7 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>サッカー
                    </button>
                    <button onClick={() => setSelectedId(8)}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === 8 ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>リレー
                    </button>
                    <button onClick={() => setSelectedId("all")}
                            className={`text-sm rounded-t px-2 py-1 border-r border-black ${selectedId === "all" ? "bg-blue-200 text-black" : "bg-blue-400 text-white border-b"}`}>全競技
                    </button>
                </>
            )}

        </div>
    )
}

export default memo(EventSwitch);