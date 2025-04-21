"use server"

import OrganizedTeams from "@/types/organizedTeams";
import groupTeams from "@/utils/groupTeams";
import {ReactNode} from "react";
import {SWRConfig} from "swr";

async function getTeams(): Promise<OrganizedTeams> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/-1`, {
        cache: "force-cache",

    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const teams = await res.json()
    return groupTeams(teams);
}

async function getLocations() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/-1`, {
        cache: "force-cache",
    });
    if (!res.ok) {  
        throw new Error("Failed to fetch data");
    }
    return await res.json()
}
async function getMatchPlans() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match-plan/-1`, {
        cache: "default",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return await res.json()
}
async function getMatchResults() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match-result/-1`, {
        cache: "default",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return await res.json()
}

const DataPreFetcher = async ({children}: {children: ReactNode}) => {
    const teams = await getTeams();
    const locations = await getLocations();
    const matchPlans = await getMatchPlans();
    const matchResults = await getMatchResults();
    
    return (
        <SWRConfig value={{fallback: {teams, locations, matchPlans, matchResults}}}>
            {children}
        </SWRConfig>
    )
}

export default DataPreFetcher;