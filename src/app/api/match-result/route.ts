import type { MatchResult } from "@prisma/client";
import { getAllMatchResults } from "../../../../lib/readQueries";

export const dynamic = "force-dynamic";
export async function GET() {
	const matchResultsMap: Record<string, MatchResult> =
		await getAllMatchResults();
	return Response.json(matchResultsMap);
}
