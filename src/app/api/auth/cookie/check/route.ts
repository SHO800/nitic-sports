import type { Session } from "@/session";
import { decrypt } from "@/session/encrypts";

// ビルド時にプレレンダリングしない
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	try {
		const { id } = await request.json();

		if (!id) {
			return Response.json(
				{ error: "Invalid or missing 'id'" },
				{ status: 400 },
			);
		}

		const decrypted = decrypt(id);
		return Response.json(JSON.parse(decrypted) as Session);
	} catch (error) {
		console.error("Error during decryption:", error);
		return Response.json(
			{ error: "Failed to process request" },
			{ status: 500 },
		);
	}
}
