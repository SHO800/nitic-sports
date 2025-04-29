"use client"

import {useParams} from 'next/navigation'
import {useData} from "@/hooks/data";
import {useEffect, useState} from "react";
import {Location, MatchPlan} from "@prisma/client";

const MatchDashboard = () => {
    const params = useParams<{ locationId: string }>()
    const {matchPlans, locations,} = useData()
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
    const [matchesInLocation, setMatchesInLocation] = useState<MatchPlan[]>([])

    useEffect(() => {
        if (!locations || !matchPlans) return;
        const location = locations.find(location => location.id.toString() === params.locationId) ?? null
        if (!location) return;
        setCurrentLocation(location)
        const relatedMatchPlans = matchPlans.filter(matchPlan => matchPlan.locationId === location.id)
        
        setMatchesInLocation(relatedMatchPlans)
        


    }, [locations, params.locationId])

    return (
        "わあ"
    )
}
export default MatchDashboard