"use client";
import type { Status } from "@prisma/client";
import { statusColors, statusNames } from "./constants";

type StatusBadgeProps = {
	status: Status;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
	return (
		<span
			className={`mr-2 px-2 py-1 rounded text-[.8em] ${statusColors[status as keyof typeof statusColors]} text-black text-center `}
		>
			{statusNames[status as keyof typeof statusNames]}
		</span>
	);
};

export default StatusBadge;
