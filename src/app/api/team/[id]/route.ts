import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {Team} from "@prisma/client";

export async function GET() {
    const teams: Team[] = await prisma.team.findMany()
    return Response.json(teams)
}
