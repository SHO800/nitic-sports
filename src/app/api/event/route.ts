import type { Event } from "@prisma/client";
import { getAllEvents } from "../../../../lib/readQueries";

export async function GET() {
	const events: Event[] = await getAllEvents();
	return Response.json(events);
}
