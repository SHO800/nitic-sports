import TournamentLine from "@/components/common/tournamentTable/TournamentLine";
import { useDataContext } from "@/contexts/dataContext";
import useTournamentLine from "@/hooks/useTournamentLine";
import type { TournamentNodeMatch } from "@/utils/tournamentUtils";
import { type MatchResult, Status } from "@prisma/client";
import React, { type CSSProperties, useMemo } from "react";

const TournamentMatchBox = ({
	match,
	boxStyle,
	matchResult,
	rowWidth,
	rowHeight,
}: {
	match: TournamentNodeMatch;
	boxStyle: CSSProperties;
	matchResult?: MatchResult;
	rowWidth: number;
	rowHeight: number;
}) => {
	const { matchResults } = useDataContext();

	const nextNodeRow = match.nextNode?.row;
	const nextNodeColumn = match.nextNode?.column;

	const { boxRef, lineCoords } = useTournamentLine(
		rowWidth,
		rowHeight,
		match.row,
		match.column,
		nextNodeRow,
		nextNodeColumn,
	);

	// 勝者判定のロジックをメモ化
	const isWonInNextNode = useMemo(() => {
		if (
			!matchResult ||
			!matchResults ||
			!match.nextNode ||
			match.nextNode?.type === "team" ||
			!matchResults[match.nextNode.matchId]
		)
			return false;
		return (
			matchResults[match.nextNode.matchId].winnerTeamId ===
			matchResult.winnerTeamId
		);
	}, [match.nextNode, matchResult, matchResults]);

	// 試合状態に応じた色の設定をメモ化
	const matchStatusColor = useMemo(() => {
		const statusColors = {
			Waiting: "text-blue-200",
			Preparing: "text-blue-500",
			Playing: "text-green-600",
			Finished: "text-yellow-500",
			Completed: "text-gray-300",
			Cancelled: "text-orange-300",
		};

		return statusColors[match.tournamentMatchNode.matchPlan.status];
	}, [match.tournamentMatchNode.matchPlan.status]);

	return (
		<div className={"h-full relative w-full "} style={boxStyle}>
			{!!match.matchId && (
				<div className="text-md text-gray-500 pr-2 absolute h-full w-full flex justify-end items-center bg-transparent">
					<p className={`${matchStatusColor} font-bold text-[1.2em]`}>
						{match.tournamentMatchNode.matchPlan.matchName}
					</p>
				</div>
			)}

			<div className="relative h-full" ref={boxRef}>
				<TournamentLine
					key={`match-${match.matchId}-line-${(
						match.tournamentMatchNode.matchPlan.status === Status.Completed
					).toString()}`}
					startX={lineCoords.startX}
					startY={lineCoords.startY}
					endX={lineCoords.endX}
					endY={lineCoords.endY}
					type={lineCoords.type}
					color1={
						match.tournamentMatchNode.matchPlan.status === Status.Completed
							? "rgb(255,0,0)"
							: "rgba(156, 163, 175, 0.8)"
					}
					color2={isWonInNextNode ? "rgb(255,0,0)" : "rgba(156, 163, 175, 0.8)"}
					thickness={4}
					animationTimingFunction={"linear"}
					duration={200}
					timeout={match.column * 200 + 200}
				/>
			</div>
		</div>
	);
};

export default React.memo(TournamentMatchBox);
