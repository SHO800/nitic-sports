import useSWR from "swr";
import fetcher from "@/utils/fetcher";

export const useTeam = () => {
    
    const {data: teams, isLoading} = useSWR('/api/team', fetcher)

    return {
        teams,
        isLoading,
    }
}   