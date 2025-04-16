import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {Event} from "@prisma/client";


export async function GET() {
    const events: Event[] = await prisma.event.findMany().then((events) => {
        //     id順にソート
        events.sort((a, b) => {
            return a.id - b.id;
        })
        return events
    })
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
    if (!response) {
        return new Response('Event not found', {status: 404})
    } else {
        return new Response('Event created', {status: 200})
    }
}


export async function PUT(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const id = Number((await params).id)
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
    if (!response) {
        return new Response('Event not found', {status: 404})
    } else {
        return new Response('Event created', {status: 200})
    }
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const id = Number((await params).id)
    // リクエストのidを元に削除
    const response = await prisma.event.delete({
        where: {
            id,
        },
    })
    if (!response) {
        return new Response('Event not found', {status: 404})
    } else {
        return new Response('Event created', {status: 200})
    }
}