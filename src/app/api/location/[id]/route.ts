import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {Location} from "@prisma/client";


export async function GET() {
    const locations: Location[] = await prisma.location.findMany()
    return Response.json(locations)
}

export async function POST(request: Request) {
    const {name, coordinates, description}: {
        name: string,
        coordinates: string
        description?: string
    } = await request.json()


    const response = await prisma.location.create({
        data: {
            name,
            coordinates: {},
            description,
        },
    })
    return Response.json(response)
}


export async function PUT(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const id = Number(params.id)
    const {name, coordinates, description}: {
        name: string,
        coordinates: string
        description?: string
    } = await request.json()
    // リクエストのidを元に更新
    const response = await prisma.location.update({
        where: {
            id,
        },
        data: {
            name,
            coordinates: {},
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
    const response = await prisma.location.delete({
        where: {
            id,
        },
    })
    return Response.json(response)
}