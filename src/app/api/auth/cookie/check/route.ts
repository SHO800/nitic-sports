import {Session} from "@/session";
import {decrypt} from "@/session/encrypts";

export async function POST(request: Request, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await request.json()
    try {
        const decrypted = decrypt(id);
        return Response.json(JSON.parse(decrypted) as Session);
    } catch {

    }
    return Response.json({})
}
    