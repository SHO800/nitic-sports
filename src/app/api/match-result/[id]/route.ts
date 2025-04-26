import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {MatchResult} from "@prisma/client";
import {updateLeagueRankings} from '@/utils/leagueRanking';

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
    {params}: { params: Promise<{ id: string }> }
) {
    const matchId = Number((await params).id)

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
        // 試合結果が変更された場合、関連する試合のステータスを更新
        const matchPlan = await prisma.matchPlan.findUnique({
            where: {
                id: matchId,
            },
        })
        if (matchPlan) {
            await prisma.matchPlan.update({
                where: {
                    id: matchId,
                },
                data: {
                    status: 'Completed',
                },
            })
            
            // 試合結果に基づいてリーグ順位を更新
            
            try {
                const updated = await updateLeagueRankings(matchPlan.eventId, matchId);
                console.log(`リーグ順位更新: ${updated ? '成功' : '不要または失敗'}`);
            } catch (error) {
                console.error('リーグ順位更新中にエラーが発生しました:', error);
            }
        }
        
        return new Response('Event created', {status: 200})
    }
    
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const matchId = Number((await params).id)
    // リクエストのidを元に削除
    const response = await prisma.matchResult.delete({
        where: {
            matchId,
        },
    })
    if (!response) {
        return new Response('Event not found', {status: 404})
    }else {
        return new Response('Event deleted', {status: 200})
    }
}