import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {Team} from "@prisma/client";

export async function GET() {
    const teams: Team[] = await prisma.team.findMany()
    return Response.json(teams)
}

export async function POST(request: Request) {
    const {name}: { name: string } = await request.json()
    const response = await prisma.team.create({
        data: {
            name,
        },
    })
    return Response.json(response)
}


export async function PUT(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const id = Number(params.id)
    const {name}: { name: string } = await request.json()
    // リクエストのidを元にcompletedを反転させる
    const response = await prisma.team.update({
        where: {
            id,
        },
        data: {
            name: name
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
    const response = await prisma.team.delete({
        where: {
            id,
        },
    })
    return Response.json(response)
}