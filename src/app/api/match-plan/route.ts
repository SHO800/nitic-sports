import {getAllMatchPlans} from "../../../../lib/readQueries";

export async function GET() {
    const matchPlans = await getAllMatchPlans()
    return Response.json(matchPlans)
}
