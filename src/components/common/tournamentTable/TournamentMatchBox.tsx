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
								teamIds,
							}: {
	match: TournamentNodeMatch;
	boxStyle: CSSProperties;
	matchResult?: MatchResult;
	rowWidth: number;
	rowHeight: number;
	teamIds?: string[];
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

	// 現在の試合が選択されたチームのものかチェック
	const isCurrentTeamMatch = useMemo(() => {
		if (!teamIds || !match.tournamentMatchNode.matchPlan.teamIds) return false;
		return match.tournamentMatchNode.matchPlan.teamIds === teamIds;
	}, [match.tournamentMatchNode.matchPlan.teamIds, teamIds]);

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

	// 強調スタイル
	const highlightStyle = useMemo(() => {
		if (!isCurrentTeamMatch) return "";

		if (match.tournamentMatchNode.matchPlan.status === "Playing") {
			return "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md shadow-lg transition-all duration-300 transform hover:scale-105";
		}

		return "bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md shadow-md transition-all duration-300";
	}, [isCurrentTeamMatch, match.tournamentMatchNode.matchPlan.status]);

	return (
		<div className={"h-full relative w-full "} style={boxStyle}>
			{!!match.matchId && (
				<div className="text-md text-gray-500 pr-2 absolute h-full w-full flex justify-end items-center bg-transparent">
					<p
						className={`${matchStatusColor} font-bold text-[1.2em] ${highlightStyle} px-2 py-1`}
					>
						{isCurrentTeamMatch ? (
							<span className="relative">
                <span className="relative z-10">
                  {match.tournamentMatchNode.matchPlan.matchName}
                </span>
                <span className="absolute inset-0 bg-white opacity-20 rounded-full blur-sm animate-ping"></span>
              </span>
						) : (
							match.tournamentMatchNode.matchPlan.matchName
						)}
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