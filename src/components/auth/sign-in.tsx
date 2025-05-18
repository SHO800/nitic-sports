"use client";

import { isLoggedIn, signIn } from "@/session";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignIn = () => {
	const [username, setUsername] = useState("");
	const router = useRouter();

	return (
		<div>
			<input
				type="text"
				value={username}
				placeholder="username"
				onChange={(event) => {
					setUsername(event.target.value);
				}}
			/>
			<button
				disabled={!username}
				onClick={async () => {
					await signIn(username);
					if (await isLoggedIn()) {
						router.push("/match");
					}
				}}
			>
				サインイン(仮)
			</button>
		</div>
	);
};

export default SignIn;
