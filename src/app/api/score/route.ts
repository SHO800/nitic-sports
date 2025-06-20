import type { Score } from "@prisma/client";
import { getAllScores } from "../../../../lib/readQueries";

export const dynamic = "force-dynamic";
export async function GET() {
	const scores: Score[] = await getAllScores();
	return Response.json(scores);
}
