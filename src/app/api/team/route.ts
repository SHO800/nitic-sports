import type { Team } from "@prisma/client";
import { getAllTeams } from "../../../../lib/readQueries";

export const dynamic = "force-dynamic";
export async function GET() {
	const teams: Team[] = await getAllTeams();
	return Response.json(teams);
}
