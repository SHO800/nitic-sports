import {prisma} from '../../../../lib/prisma';
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
