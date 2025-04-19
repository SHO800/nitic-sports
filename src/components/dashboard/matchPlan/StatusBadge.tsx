"use client"
import { Status } from "@prisma/client";
import { statusNames, statusColors } from "./constants";

type StatusBadgeProps = {
    status: Status;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
    return (
        <span className={`mr-2 px-2 py-1 rounded text-sm ${statusColors[status as keyof typeof statusColors]} text-black`}>
            {statusNames[status as keyof typeof statusNames]}
        </span>
    );
};

export default StatusBadge;
