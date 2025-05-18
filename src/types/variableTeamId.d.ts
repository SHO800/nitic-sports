export type TeamIdVariableDataType =
	| {
			type: "T";
			matchId: number;
			condition: "W" | "L";
	  }
	| {
			type: "L";
			eventId: number;
			teamDataIndex: number;
			blockName: string;
			expectedRank: number;
	  };
