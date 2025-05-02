import {prisma} from '@/../lib/prisma';
import {NextRequest} from "next/server";
import {Location} from "@prisma/client";


export async function GET() {
    const locations: Location[] = await prisma.location.findMany()
    return Response.json(locations)
}
