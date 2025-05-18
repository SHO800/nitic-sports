import LeagueTableCell from "@/components/common/leagueTable/LeagueTableCell";
import type { MatchPlan } from "@prisma/client";
import React from "react";

const LeagueTableRow = ({
	i_key,
	row,
	teamIdsLengthArray,
	blockName,
	block,
	referredMatches,
}: {
	i_key: string;
	row: number;
	teamIdsLengthArray: number[];
	blockName: string;
	block: { teamId: string; rank?: number }[];
	referredMatches: MatchPlan[];
}) => {
	return (
		<tr className={"border border-slate-300"}>
			{teamIdsLengthArray.map((col) => (
				<td
					key={`leagueTableTd${i_key}-${col}`}
					className={"border border-slate-300 h-8 w-16 text-center"}
				>
					<LeagueTableCell
						i_key={i_key}
						row={row}
						col={col}
						blockName={blockName}
						block={block}
						referredMatches={referredMatches}
					/>
				</td>
			))}
		</tr>
	);
};

export default React.memo(LeagueTableRow);
