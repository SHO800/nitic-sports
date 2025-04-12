import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {MatchResult} from "@prisma/client";

export async function GET() {
    const matchResults: MatchResult[] = await prisma.matchResult.findMany()
    
    // <matchId>: {}の形にする
    const matchResultsMap: Record<string, MatchResult> = {}
    matchResults.forEach((matchResult) => {
        matchResultsMap[matchResult.matchId.toString()] = matchResult
    })
    return Response.json(matchResultsMap)
}

export async function POST(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const matchId = Number(params.id)

    // リクエストボディから値を取得
    const {
        resultNote,
        resultSecretNote,
        teamIds,
        matchScores,
        winnerTeamId,
        loserTeamId,

    }: {
        resultNote?: string,
        resultSecretNote?: string,
        teamIds: number[],
        matchScores: string[],
        winnerTeamId: number,
        loserTeamId?: number,
    } = await request.json()
    
    if (!matchId || isNaN(matchId)) {
        return new Response('Invalid match ID', { status: 400 })
    }
    
    let response;
    
    if (await prisma.matchResult.findUnique({
        where: {
            matchId,
        },
    })) {
         response = await prisma.matchResult.update({
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
    }
    else {
        response = await prisma.matchResult.create({
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
    }
    if (!response) {
        return new Response('Event not found', {status: 404})
    }else {
        return new Response('Event created', {status: 200})
    }
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const matchId = Number(params.id)
    // リクエストのidを元に削除
    const response = await prisma.matchResult.delete({
        where: {
            matchId,
        },
    })
    if (!response) {
        return new Response('Event not found', {status: 404})
    }else {
        return new Response('Event created', {status: 200})
    }
}