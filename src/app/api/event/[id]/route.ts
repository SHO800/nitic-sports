import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {Event} from "@prisma/client";

export async function GET() {
    // todoテーブルから全件取得
    const todos: Event[] = await prisma.event.findMany()
    return Response.json(todos)
}

export async function POST(request: Request) {
    const {name}: { name: string } = await request.json()
    const response = await prisma.event.create({
        data: {
            name,
        },
    })
    return Response.json(response)
}


export async function PATCH(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const id = Number(params.id)
    const {name}: { name: string } = await request.json()
    // リクエストのidを元にcompletedを反転させる
    const response = await prisma.event.update({
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
    const response = await prisma.event.delete({
        where: {
            id,
        },
    })
    return Response.json(response)
}