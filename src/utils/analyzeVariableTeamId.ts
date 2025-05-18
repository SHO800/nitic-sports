import type { TeamIdVariableDataType } from "@/types/variableTeamId";
import { cache } from "react";

const analyzeVariableTeamId = cache(
	(variableId: string): TeamIdVariableDataType | null => {
		if (!variableId.startsWith("$")) return null;
		const variableIdSubstring = variableId.substring(1);
		const separatedStr = variableIdSubstring.split("-");
		const matchType = separatedStr[0];
		if (matchType === "T") {
			// 対象試合がトーナメント
			const matchId = Number(separatedStr[1]);
			const condition = separatedStr[2];
			if (condition !== "W" && condition !== "L") return null;
			return {
				type: "T",
				matchId,
				condition,
			};
		}
		if (matchType === "L") {
			// 対象試合がリーグ
			const eventId = Number(separatedStr[1]);
			const teamDataIndex = Number(separatedStr[2]);
			const blockName = separatedStr[3];
			const expectedRank = Number(separatedStr[4]);
			return {
				type: "L",
				eventId,
				teamDataIndex,
				blockName,
				expectedRank,
			};
		}
		return null;
	},
);

export default analyzeVariableTeamId;
