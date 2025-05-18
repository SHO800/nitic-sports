"use server";
import { prisma } from "@/../lib/prisma";
import type { Coordinates } from "@/types/location";
import { updateLeagueRankings } from "@/utils/leagueRanking";
import { type MatchPlan, Status } from "@prisma/client";
import { revalidateTag } from "next/cache";

export const isAllMatchFinished = async (eventId: number) => {
	const eventMatches: MatchPlan[] = await prisma.matchPlan.findMany({
		where: {
			eventId,
		},
	});

	return Array.from(eventMatches).every(
		(match) => match.status === "Completed" || match.status === "Cancelled",
	);
};

export async function createMatchPlan(
	eventId: number,
	teamIds: string[] | number[],
	teamNotes: string[],
	scheduledStartTime: Date,
	scheduledEndTime: Date,
	locationId: number,
	matchName?: string,
	matchNote?: string,
	isFinal = false,
	is3rdPlaceMatch = false,
) {
	// もし追加された試合に依存関係が一つもないならステータスをPreparing(開始待ちの準備中)にする

	let status: Status = "Waiting";
	if (teamIds.every((teamId) => !teamId.toString().startsWith("$"))) {
		status = "Preparing";
	}

	const response = await prisma.matchPlan.create({
		data: {
			eventId,
			matchName,
			matchNote,
			teamIds: teamIds.map((teamId) => teamId.toString()),
			teamNotes,
			scheduledStartTime,
			scheduledEndTime,
			locationId,
			isFinal,
			is3rdPlaceMatch,
			status,
		},
	});

	if (response) {
		revalidateTag("matchPlans");
	}
}

export async function updateMatchPlan(
	id: number,
	eventId: number,
	teamIds: string[] | number[],
	teamNotes: string[],
	scheduledStartTime: Date,
	scheduledEndTime: Date,
	locationId: number,
	matchName?: string,
	matchNote?: string,
	isFinal = false,
	is3rdPlaceMatch = false,
) {
	const response = await prisma.matchPlan.update({
		where: {
			id,
		},
		data: {
			eventId,
			matchName,
			matchNote,
			teamIds: teamIds.map((teamId) => teamId.toString()),
			teamNotes: teamNotes,
			scheduledStartTime,
			scheduledEndTime,
			isFinal,
			is3rdPlaceMatch,
			locationId,
		},
	});

	if (response) {
		revalidateTag("matchPlans");
	}
}

export async function updateMatchPlanStatus(
	id: number,
	status: Status,
	startedAt?: Date,
	endedAt?: Date,
) {
	const response = await prisma.matchPlan.update({
		where: {
			id,
		},
		data: {
			status,
			startedAt: startedAt
				? startedAt
				: status === "Playing"
					? new Date()
					: undefined,
			endedAt: endedAt
				? endedAt
				: status === "Finished"
					? new Date()
					: undefined,
		},
	});

	if (response) {
		revalidateTag("matchPlans");
	}
}

export async function deleteMatchPlan(id: number) {
	// リクエストのidを元に削除
	const response = await prisma.matchPlan.delete({
		where: {
			id,
		},
	});

	if (response) {
		revalidateTag("matchPlans");
	}
}

export async function createEvent(
	name: string,
	teamData: TeamData[],
	description?: string,
	isTimeBased = false,
) {
	const response = await prisma.event.create({
		data: {
			name,
			description,
			teamData: JSON.parse(JSON.stringify(teamData)),
			isTimeBased,
		},
	});
	if (response) {
		revalidateTag("events");
	}
}

export async function updateEvent(
	id: number,
	name: string,
	teamData: TeamData[],
	description?: string,
	isTimeBased = false,
) {
	const response = await prisma.event.update({
		where: {
			id,
		},
		data: {
			name,
			description,
			teamData: JSON.parse(JSON.stringify(teamData)),
			isTimeBased,
		},
	});
	if (response) {
		revalidateTag("events");
	}
}

export async function setIsCompleted(id: number, isCompleted: boolean) {
	const response = await prisma.event.update({
		where: {
			id,
		},
		data: {
			isCompleted,
		},
	});
	if (response) {
		revalidateTag("events");
	}
}

export async function deleteEvent(id: number) {
	const response = await prisma.event.delete({
		where: {
			id,
		},
	});
	if (response) {
		revalidateTag("events");
	}
}

export async function createLocation(
	name: string,
	coordinates: Coordinates,
	description?: string,
) {
	const response = await prisma.location.create({
		data: {
			name,
			coordinates: JSON.parse(JSON.stringify(coordinates)),
			description,
		},
	});
	if (response) {
		revalidateTag("locations");
	}
}

export async function updateLocation(
	id: number,
	name: string,
	coordinates: Coordinates,
	description?: string,
) {
	const response = await prisma.location.update({
		where: {
			id,
		},
		data: {
			name,
			coordinates: JSON.parse(JSON.stringify(coordinates)),
			description,
		},
	});
	if (response) {
		revalidateTag("locations");
	}
}

export async function deleteLocation(id: number) {
	const response = await prisma.location.delete({
		where: {
			id,
		},
	});
	if (response) {
		revalidateTag("locations");
	}
}

// もしその回の登録でその種目のすべての試合が終了した場合はtrueを返す
export async function createMatchResult(
	matchId: number,
	eventId: number,
	teamIds: number[],
	matchScores: string[],
	winnerTeamId: number,
	loserTeamId?: number,
	resultNote?: string,
	resultSecretNote?: string,
): Promise<boolean> {
	const response = await prisma.matchResult.create({
		data: {
			matchId,
			resultNote,
			resultSecretNote,
			teamIds,
			matchScores,
			winnerTeamId,
			loserTeamId,
		},
	});

	if (response) {
		revalidateTag("matchResults");
		// その試合のstatusをcompletedにする
		await updateMatchPlanStatus(matchId, Status.Completed);

		// 試合結果に基づいてリーグ順位を更新
		try {
			const updated = await updateLeagueRankings(eventId, matchId);
			console.log(`リーグ順位更新: ${updated ? "成功" : "不要または失敗"}`);
		} catch (error) {
			console.error("リーグ順位更新中にエラーが発生しました:", error);
		}
		if (await isAllMatchFinished(eventId)) {
			// この登録によってその種目の全試合が終了したのなら
			await setIsCompleted(eventId, true);
		}
	}
	return false;
}

export async function updateMatchResult(
	matchId: number,
	eventId: number,
	teamIds: number[],
	matchScores: string[],
	winnerTeamId: number,
	loserTeamId?: number,
	resultNote?: string,
	resultSecretNote?: string,
) {
	const response = await prisma.matchResult.update({
		where: {
			matchId,
		},
		data: {
			resultNote,
			resultSecretNote,
			teamIds,
			matchScores,
			winnerTeamId,
			loserTeamId,
		},
	});

	if (response) {
		revalidateTag("matchResults");
		// 試合結果に基づいてリーグ順位を更新
		try {
			const updated = await updateLeagueRankings(eventId, matchId);
			console.log(`リーグ順位更新: ${updated ? "成功" : "不要または失敗"}`);
		} catch (error) {
			console.error("リーグ順位更新中にエラーが発生しました:", error);
		}
	}
}

export async function deleteMatchResult(matchId: number) {
	const response = await prisma.matchResult.delete({
		where: {
			matchId,
		},
	});

	if (response) {
		revalidateTag("matchResults");
	}
}

export async function createTeam(name: string) {
	const response = await prisma.team.create({
		data: {
			name,
		},
	});
	if (response) {
		revalidateTag("teams");
	}
}

export async function updateTeam(id: number, name: string) {
	const response = await prisma.team.update({
		where: {
			id,
		},
		data: {
			name,
		},
	});
	if (response) {
		revalidateTag("teams");
	}
}

export async function deleteTeam(id: number) {
	const response = await prisma.team.delete({
		where: {
			id,
		},
	});
	if (response) {
		revalidateTag("teams");
	}
}

export async function createScores(
	eventId: number,
	rankWithEventScore: RankWithEventScore[],
) {
	const eventScores = rankWithEventScore.map((rankObj) => {
		return {
			eventId,
			teamId: rankObj.teamId,
			score: rankObj.score,
			note: typeof rankObj.detail === "string" ? rankObj.detail : undefined,
		};
	});

	try {
		await prisma.score.createMany({
			data: [...eventScores],
		});
	} catch {}
	revalidateTag("scores");
}
