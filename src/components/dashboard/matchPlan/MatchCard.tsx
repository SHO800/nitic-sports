"use client";
import MatchResult from "@/components/dashboard/matchPlan/MatchResult";
import MatchTimer from "@/components/match/MatchTimer";
import {
	type Event as EventType,
	type Location as LocationType,
	type MatchPlan as MatchPlanType,
	type MatchResult as MatchResultType,
	Status,
} from "@prisma/client";
import MatchCountdown from "./MatchCountdown";
import MatchInfo from "./MatchInfo";
import StatusBadge from "./StatusBadge";

type MatchCardProps = {
	matchPlan: MatchPlanType;
	status: Status;
	events: EventType[];
	locations: LocationType[] | undefined;
	matchResults: Record<number, MatchResultType> | undefined;
	getMatchDisplayStr: (teamId: string) => string;
	handleDeleteMatch: (matchId: number) => Promise<void>;
};

const MatchCard = ({
	matchPlan,
	status,
	events,
	locations,
	matchResults,

	getMatchDisplayStr,
	handleDeleteMatch,
}: MatchCardProps) => {
	const event = events.find((event) => event.id === matchPlan.eventId)!;
	return (
		<div className="flex flex-col justify-start items-start bg-gray-200 p-2 rounded mb-2 w-full">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center bg-amber-100">
					<MatchInfo
						matchPlan={matchPlan}
						eventName={event.name}
						locations={locations}
						getMatchDisplayStr={getMatchDisplayStr}
					/>
				</div>

				<div className="flex items-center">
					<StatusBadge status={status} />
					{/*<DeleteButton*/}
					{/*    matchId={matchPlan.id}*/}
					{/*    onDelete={() => handleDeleteMatch(matchPlan.id)}*/}
					{/*/>*/}
				</div>
			</div>

			{/* 開始前なら予定時間との差を表示 */}
			{(status === Status.Waiting || status === Status.Preparing) && (
				<MatchCountdown scheduledStartTime={matchPlan.scheduledStartTime} />
			)}

			{/* タイマー表示 - Preparing（準備中）またはPlaying（試合中）の場合だけ表示 */}
			{status === Status.Playing && <MatchTimer match={matchPlan} />}

			{/* 試合結果表示 */}
			<MatchResult
				matchPlan={matchPlan}
				matchResults={matchResults}
				event={event}
				getMatchDisplayStr={getMatchDisplayStr}
			/>
		</div>
	);
};

export default MatchCard;
