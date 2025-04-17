import MatchesWrapper from "@/components/top/MatchesWrapper";
import OrganizedTeams from "@/types/organizedTeams";
import {SWRConfig} from "swr";
import groupTeams from "@/utils/groupTeams";
import Dashboard from "@/app/dashboard/page";
import Link from "next/link";

// async function getTeams(): Promise<OrganizedTeams> {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/-1`, {
//         cache: "default",
//     });
//     if (!res.ok) {
//         throw new Error("Failed to fetch data");
//     }
//
//     const teams = await res.json()
//     return groupTeams(teams);
// }
//
// async function getLocations() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location/-1`, {
//         cache: "default",
//     });
//     if (!res.ok) {
//         throw new Error("Failed to fetch data");
//     }
//     return await res.json()
// }
// async function getMatchPlans() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match-plan/-1`, {
//         cache: "default",
//     });
//     if (!res.ok) {
//         throw new Error("Failed to fetch data");
//     }
//     return await res.json()
// }
// async function getMatchResults() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match-result/-1`, {
//         cache: "default",
//     });
//     if (!res.ok) {
//         throw new Error("Failed to fetch data");
//     }
//     return await res.json()
// }



export default async function Home() {
    // const teams = await getTeams();
    // const locations = await getLocations();
    // const matchPlans = await getMatchPlans();
    // const matchResults = await getMatchResults();


    
    return (
        // <SWRConfig value={{fallback: {teams, locations, matchPlans, matchResults}}}>
        <>
            <MatchesWrapper title={"進行中の試合"}>
                <p>a</p>
            </MatchesWrapper>
            <Link href={"/dashboard"} className={"text-blue-500 underline"}>
                Dashboard
            </Link>
        </>
        // </SWRConfig>
    );
}
