"use client"

import MatchesByLocation from "@/components/match/MatchesByLocation";
import {useRef, useState} from "react";
import {useData} from "@/hooks/data";
import Clock from "@/components/common/Clock";

const MatchDashboard = () => {
    const {locations} = useData();
    const [selectedLocation, setSelectedLocation] = useState<string[]>([])
    const [isShowSelector, setIsShowSelector] = useState<boolean>(true)
    const [isSyncScroll, setIsSyncScroll] = useState<boolean>(true)
    const refs = useRef<HTMLDivElement[]>([])

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        if (!isSyncScroll) {
            return
        }
        refs.current.forEach((ref) => {
            const refAsDiv = ref as unknown as HTMLDivElement
                if (refAsDiv !==  (event.target as HTMLDivElement))
            refAsDiv.scrollTop = (event.target as HTMLDivElement).scrollTop

        })
    }


    return (
        <div className={"relative w-screen h-[calc(100vh-130px)] overflow-hidden"}>
            <div className={"h-fit py-2 flex justify-center items-center"}>
                <Clock/>
            </div>
            <div className={"absolute left-0 top-0 transition-transform w-48 h-full bg-white"}
                 style={{
                     transform: isShowSelector ? "translateX(0)" : "translateX(-100%)"
                 }}
            >
                <select
                    className={"w-full h-full"}
                    multiple
                    size={10}
                    onChange={event => {
                        setSelectedLocation(Array.from((event.target as HTMLSelectElement).selectedOptions).map(option => option.value))
                    }}>
                    {locations?.map((location) => {
                        return (
                            <option value={location.id} key={"loc-selector-id-" + location.id}>
                                {location.name}
                            </option>
                        )
                    })
                    }
                </select>
                <div
                    className={"absolute top-0 left-full h-28 w-6 border-r-4 border-t-4 border-b-4 rounded-r-md border-gray-500 bg-white"}
                    onClick={() => setIsShowSelector(!isShowSelector)}
                >
                    場所選択
                </div>
            </div>
            <div className={"flex flex-row justify-center w-screen h-full px-4 overflow-y-scroll hidden-scrollbar"}>
                {locations && selectedLocation.map(loc => {
                    return (
                        <MatchesByLocation key={"loc-list-id-" + loc + "-len-" + selectedLocation.length}
                                           location={locations.find(location => location.id.toString() === loc)!}
                                           onScroll={handleScroll} refs={refs}
                        />
                    )
                })}

            </div>
        </div>
    )
}
export default MatchDashboard