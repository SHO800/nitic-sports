import {MatchResult} from "@prisma/client";
import {getAllMatchResults} from "../../../../lib/readQueries";

export async function GET() {
    const matchResultsMap: Record<string, MatchResult> = await getAllMatchResults()
    return Response.json(matchResultsMap)
}
