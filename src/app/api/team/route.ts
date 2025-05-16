import {prisma} from '../../../../lib/prisma';
import {Team} from "@prisma/client";

export async function GET() {
    const teams: Team[] = await prisma.team.findMany()
    return Response.json(teams)
}
