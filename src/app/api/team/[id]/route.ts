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
    if (!response) {
        return new Response('Event not found', {status: 404})
    }else {
        return new Response('Event created', {status: 200})
    }
}


export async function PUT(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const id = Number((await params).id)
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
    if (!response) {
        return new Response('Event not found', {status: 404})
    }else {
        return new Response('Event created', {status: 200})
    }
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const id = Number((await params).id)
    // リクエストのidを元に削除
    const response = await prisma.team.delete({
        where: {
            id,
        },
    })
    if (!response) {
        return new Response('Event not found', {status: 404})
    }else {
        return new Response('Event created', {status: 200})
    }
}