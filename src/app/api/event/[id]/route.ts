import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {Event} from "@prisma/client";


export async function GET() {
    const events: Event[] = await prisma.event.findMany()
    return Response.json(events)
}

export async function POST(request: Request) {
    const {name, description, teamData}: {
        name: string,
        description?: string,
        teamData: string
    } = await request.json()


    const response = await prisma.event.create({
        data: {
            name,
            description,
            teamData: (Object.values(JSON.parse(teamData)) as TeamData[]).map((team) => {
                return {
                    type: team.type,
                    blocks: team.blocks,
                    teams: team.teams,
                }
            }),

        },
    })
    return Response.json(response)
}


export async function PATCH(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const id = Number(params.id)
    const {name, description, teamData}: {
        name: string,
        description?: string,
        teamData: string
    } = await request.json()
    // リクエストのidを元に更新
    const response = await prisma.event.update({
        where: {
            id,
        },
        data: {
            name,
            description,
            teamData: (Object.values(JSON.parse(teamData)) as TeamData[]).map((team) => {
                return {
                    type: team.type,
                    blocks: team.blocks,
                    teams: team.teams,
                }
            }),
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
    const response = await prisma.event.delete({
        where: {
            id,
        },
    })
    return Response.json(response)
}