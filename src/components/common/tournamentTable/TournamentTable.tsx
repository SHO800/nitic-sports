import TournamentLine from "@/components/common/tournamentTable/TournamentLine";
import TournamentMatchBox from "@/components/common/tournamentTable/TournamentMatchBox";
import TournamentTeamBox from "@/components/common/tournamentTable/TournamentTeamBox";
import { useDataContext } from "@/contexts/dataContext";
import batchMemoNodes from "@/utils/memoBatchRendering";
import {
	type TournamentData,
	buildTournamentBracket,
} from "@/utils/tournamentUtils";
import type { MatchPlan } from "@prisma/client";
import React, { memo, useMemo } from "react";

interface TournamentBracketProps {
	eventId: number;
	isFinal: boolean;
	relatedMatchPlans: MatchPlan[];
	teamIds?: string[];
}

const TournamentTable = ({
							 eventId,
							 isFinal,
							 relatedMatchPlans,
							 teamIds,
						 }: Readonly<TournamentBracketProps>) => {
	const {
		events,
		eventLoading,
		matchPlanLoading,
		matchPlans,
		matchResultLoading,
		matchResults,
		teams,
		teamLoading,
	} = useDataContext();

	const firstRowWidth = 100;
	const rowWidth = 70;
	const rowHeight = 30;

	// データ取得後にトーナメント構造を構築
	const tournamentData = useMemo((): TournamentData | null => {
		if (eventLoading || matchPlanLoading || matchResultLoading || teamLoading) {
			return null;
		}

		// イベントが見つからない場合
		const event = events?.find((e) => e.id === eventId);
		if (!event) return null;

		return buildTournamentBracket(
			event,
			relatedMatchPlans,
			matchPlans!,
			teams!,
			isFinal,
		);
	}, [
		eventLoading,
		matchPlanLoading,
		matchResultLoading,
		teamLoading,
		events,
		relatedMatchPlans,
		matchPlans,
		teams,
		isFinal,
		eventId,
	]);

	// 最大行数を安全に計算（tournamentDataがnullの場合にもクラッシュしないように）
	const maxRowNum = useMemo(() => {
		return tournamentData?.teamIds.length
			? tournamentData.teamIds.length * 2
			: 0;
	}, [tournamentData]);

	// ノードの配置と描画 - 常に実行される
	const renderNodes = useMemo(() => {
		if (!tournamentData) return null;

		return batchMemoNodes(
			tournamentData.nodes,
			(node) => (
				<div
					style={{
						gridColumn: node.column,
						gridRow: node.row,
					}}
				>
					{node.type === "team" ? (
						<TournamentTeamBox
							node={node}
							rowWidth={rowWidth}
							rowHeight={rowHeight}
							teamIds={teamIds}
						/>
					) : (
						<TournamentMatchBox
							match={node}
							boxStyle={{}}
							matchResult={matchResults?.[node.matchId.toString()]}
							rowWidth={rowWidth}
							rowHeight={rowHeight}
							teamIds={teamIds}
						/>
					)}
				</div>
			),
			15, // チャンクサイズ
			(node) =>
				`node-${node.nodeId}-event-${eventId}-id-${node.type === "team" ? node.teamId : node.matchId}`,
		);
	}, [tournamentData, rowWidth, rowHeight, matchResults, eventId, teamIds]);

	// 特殊ノードの描画とその線 - 常に実行される
	const specialNodes = useMemo(() => {
		if (!tournamentData) return null;

		return tournamentData.nodes
			.filter((node) => !node.nextNode)
			.map((lastNode) => {
				if (lastNode.type === "team" || !lastNode.tournamentMatchNode)
					return null;

				let text = "";
				if (isFinal) {
					text = "優勝";
					if (lastNode.tournamentMatchNode.matchPlan.is3rdPlaceMatch) {
						text = "3位";
					}
				} else {
					text = "本選";
				}

				// 特殊ノードの位置を計算
				const specialNodeColumn = lastNode.column + 2;
				const specialNodeRow = lastNode.row;

				// 最終ノードから特殊ノードへの線を描画する
				return (
					<React.Fragment key={`${eventId}-specialNode-${lastNode.nodeId}`}>
						{/* 特殊ノードへの線 */}
						<div
							style={{
								gridColumn: lastNode.column,
								gridRow: lastNode.row,
								position: "relative",
								width: "100%",
								height: "100%",
							}}
						>
							<TournamentLine
								startX={rowWidth}
								startY={rowHeight / 2}
								endX={rowWidth * 2}
								endY={rowHeight / 2}
								type={"H"}
								color1={
									lastNode.tournamentMatchNode.matchPlan.status === "Completed"
										? "rgb(255,0,0)"
										: "rgba(156, 163, 175, 0.8)"
								}
								color2={
									lastNode.tournamentMatchNode.matchPlan.status === "Completed"
										? "rgb(255,0,0)"
										: "rgba(156, 163, 175, 0.8)"
								}
								thickness={4}
								animationTimingFunction={"linear"}
								duration={200}
								timeout={(lastNode.column + 2) * 200 + 100}
							/>
						</div>

						{/* 特殊ノード自体 */}
						<div
							className="text-center"
							style={{
								gridColumn: specialNodeColumn,
								gridRow: specialNodeRow,
							}}
						>
							{text}
						</div>
					</React.Fragment>
				);
			});
	}, [tournamentData, eventId, isFinal, rowWidth, rowHeight]);

	// テンプレートカラムの設定 - 常に実行される
	const gridTemplateColumns = useMemo(() => {
		if (!tournamentData) return "";
		return `${firstRowWidth}px repeat(${tournamentData.rounds + 2}, ${rowWidth}px)`;
	}, [tournamentData, firstRowWidth, rowWidth]);

	// テンプレート行の設定 - 常に実行される
	const gridTemplateRows = useMemo(() => {
		return `repeat(${maxRowNum}, ${rowHeight}px)`;
	}, [maxRowNum, rowHeight]);

	// ロード中ならスピナーを表示
	if (eventLoading || matchPlanLoading || teamLoading) {
		return (
			<div className="flex justify-center items-center h-40">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
			</div>
		);
	}

	// トーナメントのデータがなければこれ
	if (!tournamentData) {
		return (
			<div className="text-center py-10">
				<p className="text-gray-500">
					このイベントにはトーナメントデータがありません
				</p>
			</div>
		);
	}

	return (
		<div className="w-full overflow-x-auto">
			<div
				className="grid min-w-[250px] relative"
				style={{
					gridTemplateColumns,
					gridTemplateRows,
				}}
			>
				{renderNodes}
				{specialNodes}
			</div>
		</div>
	);
};

export default memo(TournamentTable);