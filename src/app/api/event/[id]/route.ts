import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {Event} from "@prisma/client";

export async function GET() {
    const events: Event[] = await prisma.event.findMany()
    return Response.json(events)
}

export async function POST(request: Request) {
    const {name, description}: { name: string, description?: string } = await request.json()
    const response = await prisma.event.create({
        data: {
            name,
            description,
        },
    })
    return Response.json(response)
}


export async function PATCH(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const id = Number(params.id)
    const {name, description}: { name: string, description?: string } = await request.json()
    const response = await prisma.event.update({
        where: {
            id,
        },
        data: {
            name,
            description,
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