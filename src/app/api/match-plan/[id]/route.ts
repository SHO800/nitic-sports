import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {MatchPlan} from "@prisma/client";

export async function GET() {
    const matchPlans: MatchPlan[] = await prisma.matchPlan.findMany().then((matchPlans) => {
    //     id順にソート
        matchPlans.sort((a, b) => {
            return a.id - b.id;
        })
        return matchPlans
    })
    return Response.json(matchPlans)
}

export async function POST(request: Request) {
    const {
        eventId,
        matchName,
        matchNote,
        teamIds,
        teamNotes,
        scheduledStartTime,
        scheduledEndTime,
        locationId,
        
    }: {
        eventId: number,
        matchName?: string,
        matchNote?: string,
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
            matchNote,
            teamIds: teamIds.map((teamId) => teamId.toString()),
            teamNotes,
            scheduledStartTime,
            scheduledEndTime,
            locationId,
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
    const {
        eventId,
        matchName,
        matchNote,
        teamIds,
        teamNotes,
        scheduledStartTime,
        scheduledEndTime,
        locationId,
    }: {
        eventId: number,
        matchName?: string,
        matchNote?: string,
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
            matchNote,
            teamIds: teamIds.map((teamId) => teamId.toString()),
            teamNotes: teamNotes,
            scheduledStartTime,
            scheduledEndTime,
            locationId,
        },
    })
    if (!response) {
        return new Response('Event not found', {status: 404})
    }else {
        return new Response('Event created', {status: 200})
    }
}

// export async function PATCH (
//     request: NextRequest,
//     {params}: { params: Promise<{ id: string }> }
// ) {
//     const id = Number((await params).id)
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
//     if (!response) {
//         return new Response('Event not found', {status: 404})
//     }else {
//         return new Response('Event created', {status: 200})
//     }
// }


export async function DELETE(
    request: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const id = Number((await params).id)
    // リクエストのidを元に削除
    const response = await prisma.matchPlan.delete({
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