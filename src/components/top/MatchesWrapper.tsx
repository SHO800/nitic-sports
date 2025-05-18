import Link from "next/link";
import type { ReactNode } from "react";

const MatchesWrapper = ({
	children,
	title,
}: { children: ReactNode; title: string }) => {
	return (
		<div className="flex flex-col gap-4 p-4 mx-2 mt-2 bg-gray-50 shadow-md rounded-lg">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">{title}</h2>
				<Link
					href={"/infomation"}
					className="text-blue-500 hover:text-blue-700"
				>
					試合情報
				</Link>
			</div>
			{/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 overflow-hidden"> */}
			<div className="flex justify-center">{children}</div>
		</div>
	);
};
export default MatchesWrapper;
