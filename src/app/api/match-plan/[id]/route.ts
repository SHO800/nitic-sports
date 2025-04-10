import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {MatchPlan} from "@prisma/client";

export async function GET() {
    const matchPlans: MatchPlan[] = await prisma.matchPlan.findMany()
    return Response.json(matchPlans)
}

export async function POST(request: Request) {
    const {
        eventId,
        matchName,
        teamIds,
        teamNotes,
        scheduledStartTime,
        scheduledEndTime,
        locationId,
        
    }: {
        eventId: number,
        matchName?: string,
        teamIds: string[] | number[],
        teamNotes: string[],
        scheduledStartTime: Date,
        scheduledEndTime: Date,
        locationId?: number,
    } = await request.json()

    const response = await prisma.matchPlan.create({
        data: {
            
            eventId,
            matchName,
            teamIds: teamIds.map((teamId) => teamId.toString()),
            teamNotes,
            scheduledStartTime,
            scheduledEndTime,
            locationId,
        },
    })
    return Response.json(response)
}


export async function PUT(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const id = Number(params.id)
    const {
        eventId,
        matchName,
        teamIds,
        teamNotes,
        scheduledStartTime,
        scheduledEndTime,
        locationId,
    }: {
        eventId: number,
        matchName?: string,
        teamIds: string[] | number[],
        teamNotes: string[],
        scheduledStartTime: Date,
        scheduledEndTime: Date,
        locationId?: number,
    } = await request.json()
    
    const response = await prisma.matchPlan.update({
        where: {
            id,
        },
        data: {
            eventId,
            matchName,
            teamIds: teamIds.map((teamId) => teamId.toString()),
            teamNotes: teamNotes,
            scheduledStartTime,
            scheduledEndTime,
            locationId,
        },
    })
    return Response.json(response)
}

// export async function PATCH (
//     request: NextRequest,
//     {params}: { params: { id: string } }
// ) {
//     const id = Number(params.id)
//     const {
//        
//     }: {
//         status: 
//     } = await request.json()
//
//     const response = await prisma.matchPlan.update({
//         where: {
//             id,
//         },
//         data: {
//             matchName,
//             teamIds: teamIds.map((teamId) => teamId.toString()),
//             teamNotes: teamNotes,
//             scheduledStartTime,
//             scheduledEndTime,
//             locationId,
//         },
//     })
//     return Response.json(response)
// }


export async function DELETE(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const id = Number(params.id)
    // リクエストのidを元に削除
    const response = await prisma.matchPlan.delete({
        where: {
            id,
        },
    })
    return Response.json(response)
}