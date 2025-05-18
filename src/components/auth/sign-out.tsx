"use client";

import { signOut } from "@/session";
import LoadingButton from "@/components/common/LoadingButton";

const SignOut = () => {
	return (
		<LoadingButton
			type="button"
			className={
				"bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded max-w-full w-[8em]"
			}
			disabled={false}
			onClick={() => {
				signOut();
			}}
		>
			サインアウト
		</LoadingButton>
	);
};

export default SignOut;
