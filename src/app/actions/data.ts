"use server";
import {prisma} from "@/../lib/prisma";
import {Status} from "@prisma/client";
import {revalidatePath} from "next/cache";
import {Coordinates} from "@/types/location";
import {updateLeagueRankings} from "@/utils/leagueRanking";


export async function createMatchPlan(
    eventId: number,
    teamIds: string[] | number[],
    teamNotes: string[],
    scheduledStartTime: Date,
    scheduledEndTime: Date,
    locationId: number,
    matchName?: string,
    matchNote?: string,
) {
    // もし追加された試合に依存関係が一つもないならステータスをPreparing(開始待ちの準備中)にする

    let status: Status = "Waiting"
    if (teamIds.every((teamId) => !teamId.toString().startsWith("$"))) {
        status = "Preparing"
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
            status,
        },
    })

    if (response) {
        revalidatePath('/dashboard')
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
            locationId,
        },
    })

    if (response) {
        revalidatePath('/dashboard')
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
            startedAt: startedAt ?? status === "Playing" ? new Date() : null,
            endedAt: endedAt ?? status === "Finished" ? new Date() : null,
        },
    })

    if (response) {
        revalidatePath('/dashboard')
    }
}

export async function deleteMatchPlan(id: number) {
    // リクエストのidを元に削除
    const response = await prisma.matchPlan.delete({
        where: {
            id,
        },
    })

    if (response) {
        revalidatePath('/dashboard')
    }
}

export async function createEvent(
    name: string,
    teamData: TeamData,
    description?: string
) {
    const response = await prisma.event.create({
        data: {
            name,
            description,
            teamData: JSON.parse(JSON.stringify(teamData)),
        },
    })
    if (response) {
        revalidatePath('/dashboard')
    }
}

export async function updateEvent(
    id: number,
    name: string,
    teamData: TeamData,
    description?: string
) {
    const response = await prisma.event.update({
        where: {
            id,
        },
        data: {
            name,
            description,
            teamData: JSON.parse(JSON.stringify(teamData)),
        },
    })
    if (response) {
        revalidatePath('/dashboard')
    }
}


export async function deleteEvent(id: number) {
    const response = await prisma.event.delete({
        where: {
            id,
        },
    })
    if (response) {
        revalidatePath('/dashboard')
    }
}

export async function createLocation(
    name: string,
    coordinates: Coordinates,
    description?: string
) {
    const response = await prisma.location.create({
        data: {
            name,
            coordinates: JSON.parse(JSON.stringify(coordinates)),
            description,
        },
    })
    if (response) {
        revalidatePath('/dashboard')
    }
}

export async function updateLocation(
    id: number,
    name: string,
    coordinates: Coordinates,
    description?: string
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
    })
    if (response) {
        revalidatePath('/dashboard')
    }
}

export async function deleteLocation(id: number) {
    const response = await prisma.location.delete({
        where: {
            id,
        },
    })
    if (response) {
        revalidatePath('/dashboard')
    }
}

export async function createMatchResult(
    matchId: number,
    eventId: number,
    teamIds: number[],
    matchScores: string[],
    winnerTeamId: number,
    loserTeamId?: number,
    resultNote?: string,
    resultSecretNote?: string,
) {
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
    })

    if (response) {
        revalidatePath('/dashboard')
        // 試合結果に基づいてリーグ順位を更新
        try {
            const updated = await updateLeagueRankings(eventId, matchId);
            console.log(`リーグ順位更新: ${updated ? '成功' : '不要または失敗'}`);
        } catch (error) {
            console.error('リーグ順位更新中にエラーが発生しました:', error);
        }
    }
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
    })

    if (response) {
        revalidatePath('/dashboard')
        // 試合結果に基づいてリーグ順位を更新
        try {
            const updated = await updateLeagueRankings(eventId, matchId);
            console.log(`リーグ順位更新: ${updated ? '成功' : '不要または失敗'}`);
        } catch (error) {
            console.error('リーグ順位更新中にエラーが発生しました:', error);
        }
    }
}

export async function deleteMatchResult(matchId: number) {
    const response = await prisma.matchResult.delete({
        where: {
            matchId,
        },
    })

    if (response) {
        revalidatePath('/dashboard')
    }
}

export async function createTeam(name: string) {
    const response = await prisma.team.create({
        data: {
            name,
        },
    })
    if (response) {
        revalidatePath('/dashboard')
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
    })
    if (response) {
        revalidatePath('/dashboard')
    }
}

export async function deleteTeam(id: number) {
    const response = await prisma.team.delete({
        where: {
            id,
        },
    })
    if (response) {
        revalidatePath('/dashboard')
    }
}