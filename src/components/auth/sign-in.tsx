"use client";

import { isLoggedIn, signIn } from "@/session";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingButton from "@/components/common/LoadingButton";

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
			<LoadingButton
				type="button"
				disabled={false}
				className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded"
				onClick={async () => {
					await signIn(username);
					if (await isLoggedIn()) {
						router.push("/match");
					}
				}}
			>
				サインイン(仮)
			</LoadingButton>
		</div>
	);
};

export default SignIn;
