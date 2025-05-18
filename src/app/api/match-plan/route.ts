import { getAllMatchPlans } from "../../../../lib/readQueries";

export const dynamic = "force-dynamic";
export async function GET() {
	const matchPlans = await getAllMatchPlans();
	return Response.json(matchPlans);
}
