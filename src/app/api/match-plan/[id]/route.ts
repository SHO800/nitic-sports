import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {MatchPlan, Status} from "@prisma/client";

export async function GET() {
    const matchPlans: MatchPlan[] = await prisma.matchPlan.findMany().then((matchPlans) => {
    //     id順にソート
        matchPlans.sort((a, b) => {
            return a.id - b.id;
        })
        return matchPlans
    })
    return Response.json(matchPlans)
}
