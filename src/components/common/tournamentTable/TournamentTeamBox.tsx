import TournamentLine from "@/components/common/tournamentTable/TournamentLine";
import { useDataContext } from "@/contexts/dataContext";
import useTournamentLine from "@/hooks/useTournamentLine";
import type { TournamentNodeTeam } from "@/utils/tournamentUtils";
import React, { useMemo } from "react";

const TournamentTeamBox = ({
							   node,
							   rowWidth,
							   rowHeight,
							   teamIds,
						   }: {
	node: TournamentNodeTeam;
	rowWidth: number;
	rowHeight: number;
	teamIds?: string[];
}) => {
	const { getMatchDisplayStr, getActualTeamIdByVariableId, matchResults } =
		useDataContext();

	const nextNodeRow = node.nextNode?.row;
	const nextNodeColumn = node.nextNode?.column;

	const { boxRef, lineCoords } = useTournamentLine(
		rowWidth,
		rowHeight,
		node.row,
		node.column,
		nextNodeRow,
		nextNodeColumn,
	);

	const displayStr = getMatchDisplayStr(node.teamId);

	// チームが現在のチームIDと一致するかチェック
	const isCurrentTeam = useMemo(() => {
		if (!teamIds) return false;
		return node.teamId === teamIds[0]; // 単一チームの場合は最初のIDと比較
	}, [node.teamId, teamIds]);

	const isWonInNextNode = useMemo(() => {
		const nextNode = node.nextNode;
		if (!matchResults || !nextNode || nextNode?.type === "team") return false;
		const actualId = getActualTeamIdByVariableId(node.teamId.toString());
		if (!actualId) return false;
		const result = matchResults[nextNode.matchId];
		if (!result) return false;
		return result.winnerTeamId === actualId;
	}, [getActualTeamIdByVariableId, matchResults, node.nextNode, node.teamId]);

	return (
		<div
			className={`flex justify-end items-center p-2 relative h-10 w-full 
				${isCurrentTeam ? "bg-amber-500 text-white rounded" : ""}`}
			ref={boxRef}
		>
			<span className={isCurrentTeam ? "animate-pulse" : ""}>{displayStr}</span>

			{
				<TournamentLine
					startX={lineCoords.startX}
					startY={lineCoords.startY}
					endX={lineCoords.endX}
					endY={lineCoords.endY}
					type={lineCoords.type}
					color1={isWonInNextNode ? "rgb(255,0,0)" : "rgba(156, 163, 175, 1)"}
					color2={isWonInNextNode ? "rgb(255,0,0)" : "rgba(156, 163, 175, 1)"}
					thickness={4}
					animationTimingFunction={"linear"}
					duration={200}
					timeout={200}
				/>
			}
		</div>
	);
};

export default React.memo(TournamentTeamBox);