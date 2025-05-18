"use server";

import { decrypt, encrypt } from "@/session/encrypts";
import { cookies } from "next/headers";

export type Session = {
	username: string;
};

export const isLoggedIn = async (): Promise<boolean> => {
	const session = await getSession();
	return session?.username === process.env.MATCH_EDITOR_PASS;
};

export const getSession = async (): Promise<Session | null> => {
	const cookieStore = await cookies();
	const session = cookieStore.get("sess");

	if (session?.value) {
		console.log(session);
		try {
			const decrypted = decrypt(session.value);
			console.log(decrypted);
			return JSON.parse(decrypted) as Session;
		} catch {
			// 無効なセッションは無視します
		}
	}

	return null;
};

export const setSession = async (session: Session) => {
	const cookieStore = await cookies();
	const encrypted = encrypt(JSON.stringify(session));
	cookieStore.set("sess", encrypted);
};

export const removeSession = async () => {
	const cookieStore = await cookies();
	cookieStore.delete("sess");
};
export const signIn = async (username: string) => {
	await setSession({ username });
};

export const signOut = async () => {
	await removeSession();
};
