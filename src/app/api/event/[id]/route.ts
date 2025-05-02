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
