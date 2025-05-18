import type { Event } from "@prisma/client";
import { getAllEvents } from "../../../../lib/readQueries";

export const dynamic = "force-dynamic";
export async function GET() {
	const events: Event[] = await getAllEvents();
	return Response.json(events);
}
