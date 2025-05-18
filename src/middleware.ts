import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/match")) {
		const cookieStore = await cookies();
		const session = cookieStore.get("sess");

		const res = await fetch(new URL("/api/auth/cookie/check", request.url), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: session?.value }),
		});
		const json = await res.json();
		if (json.username !== process.env.MATCH_EDITOR_PASS) {
			return NextResponse.error();
		}
	}
	return NextResponse.next();
}
