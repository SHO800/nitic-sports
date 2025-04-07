import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {MatchResult} from "@prisma/client";

export async function GET() {
    const matchResults: MatchResult[] = await prisma.matchResult.findMany()
    return Response.json(matchResults)
}


export async function POST(request: Request) {
    const {
        matchId,
        resultNote,
        resultSecretNote,
        teamIds,
        matchScores,
        winnerTeamId,
        loserTeamId,
        startedAt,
        endedAt,
        isCanceled,
        cancelNote

    }: {
        matchId: number,
        resultNote?: string,
        resultSecretNote?: string,
        teamIds: string[] | number[],
        matchScores: string[],
        winnerTeamId: number,
        loserTeamId?: number,
        startedAt: Date,
        endedAt: Date,
        isCanceled: boolean,
        cancelNote?: string,
        
    } = await request.json()

    const response = await prisma.matchResult.create({
        data: {
            matchId,
            resultNote,
            resultSecretNote,
            teamIds: teamIds.map((teamId) => teamId.toString()),
            matchScores,
            winnerTeamId,
            loserTeamId,
            startedAt,
            endedAt,
            isCanceled,
            cancelNote
        },
    })
    return Response.json(response)
}


export async function PATCH(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const id = Number(params.id)
    const {
        matchId,
        resultNote,
        resultSecretNote,
        teamIds,
        matchScores,
        winnerTeamId,
        loserTeamId,
        startedAt,
        endedAt,
        isCanceled,
        cancelNote

    }: {
        matchId: number,
        resultNote?: string,
        resultSecretNote?: string,
        teamIds: string[] | number[],
        matchScores: string[],
        winnerTeamId: number,
        loserTeamId?: number,
        startedAt: Date,
        endedAt: Date,
        isCanceled: boolean,
        cancelNote?: string,
    } = await request.json()
    
    const response = await prisma.matchResult.update({
        where: {
            id,
        },
        data: {
            matchId,
            resultNote,
            resultSecretNote,
            teamIds: teamIds.map((teamId) => teamId.toString()),
            matchScores,
            winnerTeamId,
            loserTeamId,
            startedAt,
            endedAt,
            isCanceled,
            cancelNote
        },
    })
    return Response.json(response)
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const id = Number(params.id)
    // リクエストのidを元に削除
    const response = await prisma.matchResult.delete({
        where: {
            id,
        },
    })
    return Response.json(response)
}