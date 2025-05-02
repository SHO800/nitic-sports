"use client"

import {useParams} from 'next/navigation'
import MatchesByLocation from "@/components/match/MatchesByLocation";

const MatchDashboard = () => {
    const params = useParams<{ locationId: string }>()
    return (
        <div className={"flex flex-row w-screen h-[calc(100vh-129px)] overflow-y-scroll"}>
            <MatchesByLocation locationId={"1"}/>
            <MatchesByLocation locationId={"2"}/>
            <MatchesByLocation locationId={"3"}/>
            <MatchesByLocation locationId={"4"}/>
            <MatchesByLocation locationId={"5"}/>
        </div>
    )
}
export default MatchDashboard