"use server "
import {MatchPlan} from "@prisma/client";
import {prisma} from "../../lib/prisma";


export const isAllMatchFinished = async (eventId: number) => {
    const eventMatches: MatchPlan[] = await prisma.matchPlan.findMany({
        where: {
            eventId
        }
    })
    
    return Array.from(eventMatches).every(match => match.status === "Completed" || match.status === "Cancelled")
}

export const calculateEventScore = async (eventId: number) => {
    // その種目の全ての試合が完了しているか確認
    if (!await isAllMatchFinished(eventId)) return
    
    // tournamentDataの最後の1つが常に本選
    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        },
    })
    if (!event) return
    
    // 本選
    const finalData = (event.teamData as unknown as TeamData[])[event.teamData.length - 1]
    if (!finalData) return;
    
    // リーグ形式ならば別の箇所で既に計算されているのでその順位を使用
    
    // リーグ形式だったら
    const eventMatches: MatchPlan[] = await prisma.matchPlan.findMany({
        where: {
            eventId
        }
    })
}
