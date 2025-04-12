import {prisma} from "../../../../../lib/prisma";
import {Score} from "@prisma/client";

export async function GET() {
    const scores: Score[] = await prisma.score.findMany()
    return Response.json(scores)
}
