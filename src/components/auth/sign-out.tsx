"use client";

import { signOut } from "@/session";

const SignOut = () => {
	return (
		<button
			onClick={() => {
				signOut();
			}}
		>
			サインアウト
		</button>
	);
};

export default SignOut;
