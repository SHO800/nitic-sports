import {prisma} from '../../../../lib/prisma';
import {Location} from "@prisma/client";


export async function GET() {
    const locations: Location[] = await 
    return Response.json(locations)
}
