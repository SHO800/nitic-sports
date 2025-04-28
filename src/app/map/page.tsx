"use client"

import MapContainer from "@/components/map/MapContainer";
import EventModal from "@/components/map/EventModal";
import { useState } from "react";

const Map = () => {

    const [isGym1Open, setIsGym1Open] = useState(false);
    const [isGym2Open, setIsGym2Open] = useState(false);
    const [isModalOpen, setModalIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null); 

    const openModal = (id:number) => {
        setModalIsOpen(true);
        setSelectedId(id);

    }

    const closeModal = () => setModalIsOpen(false);

    return(
        <>
            <div>
                <EventModal placeId={selectedId} isOpen={isModalOpen} closeModal={closeModal} />
            </div>

            <div className="flex flex-col items-center min-h-screen">
                
                <div className="text-2xl mt-2 bg-blue-100 rounded">
                    <p className="pl-2">全体マップ(南側)</p>
                    <div onClick={() => openModal(8)} className="absolute z-50 w-[186px] h-[64px] ml-37.5 mt-7 rounded-full bg-white opacity-50 hover:opacity-70 text-[18px] flex justify-center items-center">陸上競技場</div>
                    <a href="#gym-1"  className="absolute z-50 w-[36px] h-[44px] ml-29.5 mt-29.5 bg-white opacity-50 hover:opacity-70 text-[9px] rounded flex items-center justify-center">第一<br/>体育館</a>
                    <a href="#gym-2" className="absolute z-50 w-[37px] h-[38px] ml-7 mt-35.5 bg-white opacity-50 hover:opacity-70 text-[9px] rounded flex items-center justify-center">第二<br/>体育館</a>
                    <MapContainer tag={0}/>
                </div>
                
                <div className="text-2xl mt-2 bg-blue-100 rounded">
                    <p  className="pl-2">全体マップ(北側)</p>
                    <div onClick={() => openModal(8)} className="absolute z-50 w-[94px] h-[61px] ml-4 mt-10 rounded-r-full bg-white opacity-50 hover:opacity-70 text-[16px] flex items-center">陸上競技場</div>
                    <div onClick={() => openModal(9)} className="absolute z-50 w-[140px] h-[100px] ml-54 mt-60 bg-white opacity-50 hover:opacity-70 text-[18px] rounded flex justify-center items-center"> 野球場</div>
                    <a href="#tenniscoat" className="absolute z-50 w-[54px] h-[60px] ml-55.5 mt-44.5 bg-white opacity-50 hover:opacity-70 text-[9px] rounded flex items-center">テニスコート</a>
                    <a href="#tenniscoat" className="absolute z-50 w-[64px] h-[57px] ml-34.5 mt-48.5 bg-white opacity-50 hover:opacity-70 text-[9px] rounded flex items-center justify-center">テニスコート</a>
                    <MapContainer tag={1}/>
                </div>

                <div className="text-2xl mt-2 bg-blue-100 rounded">
                    <p id="tenniscoat" className="pl-2">テニスコート</p>
                    <div onClick={() => openModal(4)} className="absolute z-50 w-[76px] h-[42px] ml-17 mt-37.5 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">A</div>
                    <div onClick={() => openModal(2)} className="absolute z-50 w-[77px] h-[42px] ml-17 mt-53 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">B</div>
                    <div className="absolute z-50 w-[77px] h-[42px] ml-17 mt-67 bg-white opacity-50 rounded flex justify-center items-center">予備</div>
                    <div onClick={() => openModal(1)} className="absolute z-50 w-[76px] h-[42px] ml-58 mt-24.5 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">C</div>
                    <div onClick={() => openModal(1)} className="absolute z-50 w-[76px] h-[42px] ml-58.5 mt-41 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">D</div>
                    <MapContainer tag={2}/>
                </div>
                
                <div className="text-2xl mt-2 bg-blue-100 rounded">
                    <div className="flex flex-row itmes-center -mb-2 p-2">
                        <p id="gym-1" className="pl-2">第1体育館</p>
                        <button onClick={() => setIsGym1Open(!isGym1Open)} className="border rounded mt-0.5 ml-8 px-1">{isGym1Open ? "閉じる" : "別パターン表示"}</button>
                    </div>
                    <div onClick={() => openModal(2)} className="absolute z-50 w-[132px] h-[229px] ml-5.5 mt-18.5 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">B</div>
                    <div onClick={() => openModal(1)} className="absolute z-50 w-[132px] h-[229px] ml-39 mt-18.5 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">A</div>
                    <MapContainer tag={3}/>
                </div>
                {isGym1Open && (
                    <div className="text-2xl mt-2 bg-blue-200 rounded">
                        <p id="gym-1" className="pl-2">第1体育館(バドミントン仕様(仮))</p>
                        <div onClick={() => openModal(4)} className="absolute z-50 w-[132px] h-[75px] ml-5.5 mt-18.5 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">C</div>
                        <div onClick={() => openModal(2)} className="absolute z-50 w-[132px] h-[77px] ml-5.5 mt-37.5 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">D</div>
                        <div onClick={() => openModal(3)} className="absolute z-50 w-[132px] h-[75px] ml-5.5 mt-57 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">E</div>
                        <div onClick={() => openModal(1)} className="absolute z-50 w-[132px] h-[75px] ml-39 mt-28 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">A</div>
                        <div onClick={() => openModal(1)} className="absolute z-50 w-[132px] h-[75px] ml-39 mt-47.5 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">B</div>
                        <MapContainer tag={3}/>
                    </div>
                )}

                <div className="text-2xl my-2 bg-blue-100 rounded">
                    <div className="flex flex-row itmes-center -mb-2 p-2">
                        <p id="gym-2" className="pl-2">第2体育館</p>
                        <button onClick={() => setIsGym2Open(!isGym2Open)} className="border rounded mt-0.5 ml-8 px-1">{isGym2Open ? "閉じる" : "別パターン表示"}</button>
                    </div>
                    <div onClick={() => openModal(6)} className="absolute z-50 w-[133px] h-[220px] ml-5.5 mt-19 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">B</div>
                    <div onClick={() => openModal(5)} className="absolute z-50 w-[132px] h-[220px] ml-39.5 mt-19 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">A</div>
                    <MapContainer tag={4}/>
                </div>
                {isGym2Open && (
                    <div className="text-2xl my-2 bg-blue-200 rounded">
                        <p id="gym-2" className="pl-2">第2体育館(バレー決勝仕様(仮))</p>
                        <div onClick={() => openModal(6)} className="absolute z-50 w-[266px] h-[220px] ml-5.5 mt-19 bg-white opacity-50 hover:opacity-70 rounded flex justify-center items-center">A</div>
                        <MapContainer tag={4}/>
                    </div>

                )}

            </div>
        </>
    )
}

export default Map;