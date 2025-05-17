import {Team} from "@prisma/client";
import {getAllTeams} from "../../../../lib/readQueries";

export async function GET() {
    const teams: Team[] = await getAllTeams()
    return Response.json(teams)
}
