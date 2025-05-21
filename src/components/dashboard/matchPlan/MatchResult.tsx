"use client";
import { MatchResultForm } from "@/components/dashboard/MatchResultForm";
import MatchResultTable from "@/components/common/MatchResultTable";
import type {
	Event,
	MatchPlan as MatchPlanType,
	MatchResult as MatchResultType,
} from "@prisma/client";

type MatchResultProps = {
	matchPlan: MatchPlanType;
	matchResults: Record<number, MatchResultType> | undefined;
	event: Event;
	getMatchDisplayStr: (teamId: string) => string;
};

const MatchResult = ({
	matchPlan,
	matchResults,
	event,
	getMatchDisplayStr,
}: MatchResultProps) => {
	const matchResult = matchResults ? matchResults[matchPlan.id] : undefined;
	const matchTime =
		matchPlan.startedAt && matchPlan.endedAt
			? Math.floor(
					(new Date(matchPlan.endedAt).getTime() -
						new Date(matchPlan.startedAt).getTime()) /
						1000 /
						60,
				)
			: 0;

	return (
		<>
			{matchResult ? (
				<div>
					<MatchResultTable
						teamIds={matchResult.teamIds}
						matchScores={matchResult.matchScores}
						winnerTeamId={matchResult.winnerTeamId}
						getMatchDisplayStr={getMatchDisplayStr}
						eventIsTimeBased={event.isTimeBased}
						matchTime={matchTime}
						resultNote={matchResult.resultNote}
					/>
				</div>
			) : null}
			{matchPlan.status === "Finished" &&
				matchPlan.startedAt &&
				matchPlan.endedAt && (
					<MatchResultForm
						matchPlan={matchPlan}
						matchResult={matchResult}
						isTimeBased={event.isTimeBased}
					/>
				)}
		</>
	);
};

export default MatchResult;
