import { useDataContext } from "@/contexts/dataContext";
import type { MatchPlan } from "@prisma/client";
import { memo, useMemo } from "react";

const LeagueTableCell = ({
	i_key,
	row,
	col,
	blockName,
	block,
	referredMatches,
}: {
	i_key: string;
	row: number;
	col: number;
	blockName: string;
	block: { teamId: string }[];
	referredMatches: MatchPlan[];
}) => {
	const { getMatchDisplayStr, matchResults } = useDataContext();

	// 基本的なセル内容の条件判定をメモ化
	const cellContent = useMemo(() => {
		// 無駄な計算を回避
		if (referredMatches.length === 0) return null;

		// ヘッダーセルの処理
		if (row === -1 && col === -1) {
			return <HeaderCell text={blockName} isBold={true} />;
		}

		if (row === -1 && col > -1) {
			const teamName = getMatchDisplayStr(block[col]?.teamId);
			return <HeaderCell text={teamName} />;
		}

		if (col === -1 && row > -1) {
			const teamName = getMatchDisplayStr(block[row]?.teamId);
			return <HeaderCell text={teamName} isSmall={true} />;
		}

		// 同じチーム同士のセルは表示しない
		if (row === col) return null;

		// 試合情報の取得
		const leftSideTeam = block[row]?.teamId;
		const rightSideTeam = block[col]?.teamId;
		const match = referredMatches.find((match) => {
			return (
				match.teamIds.includes(leftSideTeam) &&
				match.teamIds.includes(rightSideTeam)
			);
		});

		if (!match) return null;

		return (
			<MatchCell
				match={match}
				leftSideTeam={leftSideTeam}
				rightSideTeam={rightSideTeam}
			/>
		);
	}, [
		blockName,
		block,
		col,
		getMatchDisplayStr,
		i_key,
		matchResults,
		referredMatches,
		row,
	]);

	return cellContent;
};

// ヘッダーセルコンポーネント
const HeaderCell = memo(
	({
		text,
		isBold = false,
		isSmall = false,
	}: {
		text: string;
		isBold?: boolean;
		isSmall?: boolean;
	}) => {
		return (
			<p className={`${isBold ? "font-bold" : ""} ${isSmall ? "text-sm" : ""}`}>
				{text}
			</p>
		);
	},
);

HeaderCell.displayName = "HeaderCell";

// 試合情報セルコンポーネント
const MatchCell = memo(
	({
		match,
		leftSideTeam,
		rightSideTeam,
	}: {
		match: MatchPlan;
		leftSideTeam: string;
		rightSideTeam: string;
	}) => {
		const { matchResults } = useDataContext();

		const matchStr = match.matchName
			? match.matchName
			: match.matchNote
				? match.matchNote
				: "";

		// 試合状態に応じた表示クラスを決定
		let cellClassName = "text-sm p-2";
		let content = matchStr;

		switch (match.status) {
			case "Playing":
				cellClassName += " bg-[rgba(200,255,200,.3)] arrow-flowing-bg";
				content = `(${matchStr})`;
				break;
			case "Finished":
				cellClassName += " animate-pulse";
				content = `(${matchStr})`;
				break;
			case "Completed": {
				// 試合結果がある場合はスコアを表示
				const matchResult = matchResults?.[match.id];
				if (matchResult) {
					const leftSideTeamIndex = match.teamIds.indexOf(leftSideTeam);
					const rightSideTeamIndex = match.teamIds.indexOf(rightSideTeam);

					if (leftSideTeamIndex !== -1 && rightSideTeamIndex !== -1) {
						const leftSideTeamScore =
							matchResult.matchScores[leftSideTeamIndex];
						const rightSideTeamScore =
							matchResult.matchScores[rightSideTeamIndex];
						content = `${leftSideTeamScore} - ${rightSideTeamScore}`;
					}
				}
				break;
			}
			default:
				content = `(${matchStr})`;
		}

		return (
			<div className={cellClassName}>
				<p className="text-sm">{content}</p>
			</div>
		);
	},
);

MatchCell.displayName = "MatchCell";

export default memo(LeagueTableCell);
