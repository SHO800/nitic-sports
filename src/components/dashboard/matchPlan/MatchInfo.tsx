"use client";
import type { MatchPlan as MatchPlanType } from "@prisma/client";
import {memo} from "react";

type MatchInfoProps = {
	matchPlan: MatchPlanType;
	eventName: string;
	locations: any[] | undefined;
	getMatchDisplayStr: (teamId: string) => string;
};

const MatchInfo = ({
	matchPlan,
	eventName,
	locations,
	getMatchDisplayStr,
}: MatchInfoProps) => {
	return (
		<p className="text-black">
			{matchPlan.id}| {matchPlan.matchName}| {matchPlan.eventId} {eventName} |{" "}
			{matchPlan.teamIds
				.map((teamId, index) => {
					let result = getMatchDisplayStr(teamId);
					if (result === "") return "";
					if (matchPlan.teamNotes[index]) {
						result += `(${matchPlan.teamNotes[index]})`;
					}
					return result;
				})
				.join(" vs ")}{" "}
			|{" "}
			{new Date(matchPlan.scheduledStartTime).toLocaleString("ja-JP", {
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			})}{" "}
			~{" "}
			{new Date(matchPlan.scheduledEndTime).toLocaleString("ja-JP", {
				hour: "2-digit",
				minute: "2-digit",
			})}{" "}
			|{" "}
			{matchPlan.locationId &&
				locations?.find((location) => location.id === matchPlan.locationId)
					?.name}{" "}
			{matchPlan.matchNote && matchPlan.matchNote.length > 0 ? (
				<span className="ml-1 text-gray-500">({matchPlan.matchNote})</span>
			) : null}
		</p>
	);
};

export default memo(MatchInfo);
