import {Location} from "@prisma/client";
import {getAllLocations} from "../../../../lib/readQueries";


export async function GET() {
    const locations: Location[] = await getAllLocations()
    return Response.json(locations)
}
