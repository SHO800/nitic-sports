import { getAllMatchPlans, getAllMatchResults, getAllScores, getAllEvents } from "../../../../lib/readQueries";

export const dynamic = "force-dynamic";

export async function GET() {
    const [matchPlans, matchResults, scores, events] = await Promise.all([
        getAllMatchPlans(),
        getAllMatchResults(),
        getAllScores(),
        getAllEvents(),
    ]);
    return Response.json({ matchPlans, matchResults, scores, events });
}

