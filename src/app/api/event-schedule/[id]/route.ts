import {prisma} from "../../../../../lib/prisma";
import {EventSchedule} from "@prisma/client";

export async function GET() {
    const eventSchedules: EventSchedule[] = await prisma.eventSchedule.findMany()
    return Response.json(eventSchedules)
    
}