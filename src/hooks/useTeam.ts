import fetcher from "@/utils/fetcher";
import useSWR from "swr";

export const useTeam = () => {
	const { data: teams, isLoading } = useSWR("/api/team", fetcher);

	return {
		teams,
		isLoading,
	};
};
