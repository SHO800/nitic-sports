import type OrganizedTeams from "@/types/organizedTeams";
import type { Team } from "@prisma/client";
import { cache } from "react";

const groupTeams: (teams: Team[]) => { [p: string]: Team[] } = cache(
	(teams: Team[]) => {
		// nameの最初の1文字目でグルーピング
		if (!Array.isArray(teams)) return {};
		const organizedTeams = teams.reduce((acc: OrganizedTeams, team: Team) => {
			const firstLetter = team.name.charAt(0).toUpperCase();
			if (!acc[firstLetter]) {
				acc[firstLetter] = [];
			}
			acc[firstLetter].push(team);
			return acc;
		}, {});
		// 要素数が1つのグループはtmp["他"]にまとめる
		const otherGroups: Team[] = [];
		for (const key in organizedTeams) {
			if (organizedTeams[key].length === 1) {
				otherGroups.push(organizedTeams[key][0]);
				delete organizedTeams[key];
			}
		}
		if (otherGroups.length > 0) {
			organizedTeams.他 = otherGroups;
		}
		return {
			...organizedTeams,
		};
	},
);

export default groupTeams;
