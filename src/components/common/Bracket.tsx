"use client";

import LeagueTable from "@/components/common/leagueTable/LeagueTable";
import TournamentTable from "@/components/common/tournamentTable/TournamentTable";
import { useDataContext } from "@/contexts/dataContext";
import type { MatchPlan } from "@prisma/client";
import {
	Suspense,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

// トーナメント部分を別コンポーネントに分離
const TournamentSection = memo(
	({
		 eventId,
		 isFinal,
		 relatedMatchPlans,
		 teamIds,
	 }: {
		eventId: number;
		isFinal: boolean;
		relatedMatchPlans: MatchPlan[];
		teamIds?: string[];
	}) => (
		<TournamentTable
			key={`bracket-tournament-${eventId}-${isFinal}`}
			eventId={eventId}
			isFinal={isFinal}
			relatedMatchPlans={relatedMatchPlans}
			teamIds={teamIds}
		/>
	),
);

TournamentSection.displayName = "TournamentSection";

// リーグ部分を別コンポーネントに分離 - すべてのブロックを同時表示
const LeagueSection = memo(
	({
		 eventId,
		 teamData,
		 teamIds,
	 }: {
		eventId: number;
		teamData: LeagueTeamData;
		teamIds?: string[];
	}) => {
		const blockNames = useMemo(
			() => Object.keys(teamData.blocks),
			[teamData.blocks],
		);

		return (
			<div className="space-y-8">
				{blockNames.map((blockName) => (
					<div key={`league-${eventId}-${blockName}`} className="mb-6">
						<h3 className="text-xl font-semibold mb-4">{blockName}ブロック</h3>
						<LeagueTable
							key={`league-table-${eventId}-${blockName}`}
							i_key={`bracket-league-${eventId}-${blockName}`}
							eventId={eventId}
							blockName={blockName}
							block={teamData.blocks[blockName]}
							receivedTeamIds={teamIds}
						/>
					</div>
				))}
			</div>
		);
	},
);

LeagueSection.displayName = "LeagueSection";

// タブボタン部分を別コンポーネントに分離
const TabButtons = memo(
	({
		 hasPreliminary,
		 hasFinal,
		 isFinal,
		 preliminaryType,
		 finalType,
		 setIsFinal,
	 }: {
		hasPreliminary: boolean;
		hasFinal: boolean;
		isFinal: boolean;
		preliminaryType: "tournament" | "league" | null;
		finalType: "tournament" | "league" | null;
		setIsFinal: (value: boolean) => void;
	}) => (
		<div className="mb-2 ">
			<div className="flex space-x-4">
				{hasPreliminary && (
					<button
						className={`px-6 py-2 rounded-lg transition-colors shadow-md  ${
							!isFinal
								? "bg-blue-600 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
						onClick={() => setIsFinal(false)}
					>
						{hasFinal ? "予選" : "本選"} (
						{preliminaryType === "tournament" ? "トーナメント" : "リーグ"})
					</button>
				)}
				{hasFinal && (
					<button
						className={`px-6 py-2 rounded-lg transition-colors shadow-md ${
							isFinal
								? "bg-blue-600 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
						onClick={() => setIsFinal(true)}
					>
						本選 ({finalType === "tournament" ? "トーナメント" : "リーグ"})
					</button>
				)}
			</div>
		</div>
	),
);

TabButtons.displayName = "TabButtons";

// メインのBracketコンポーネント
const Bracket = ({
					 eventId,
					 matchPlans,
					 teamIds,
				 }: {
	eventId: number;
	matchPlans: MatchPlan[];
	teamIds?: string[];
}) => {
	const [isFinal, setIsFinal] = useState(false);
	const { events, eventLoading } = useDataContext();

	const [hasPreliminary, setHasPreliminary] = useState(false);
	const [hasFinal, setHasFinal] = useState(false);
	const [eventName, setEventName] = useState("");
	const [preliminaryType, setPreliminaryType] = useState<
		"tournament" | "league" | null
	>(null);
	const [finalType, setFinalType] = useState<"tournament" | "league" | null>(
		null,
	);
	const [relatedMatchPlans, setRelatedMatchPlans] = useState<MatchPlan[]>([]);

	// 現在選択されている大会の形式を取得
	const getCurrentType = useCallback(() => {
		return isFinal ? finalType : preliminaryType;
	}, [isFinal, finalType, preliminaryType]);

	// 現在のイベントをメモ化
	const currentEvent = useMemo(() => {
		if (!events) return null;
		return events.find((e) => e.id === eventId) || null;
	}, [events, eventId]);

	// チームデータを取得 - メモ化利用
	const teamData = useMemo(() => {
		if (!currentEvent) return null;

		const teamData = currentEvent.teamData as unknown as TeamData[];
		if (!Array.isArray(teamData) || teamData.length === 0) return null;

		return isFinal && teamData.length > 1 ? teamData[1] : teamData[0];
	}, [currentEvent, isFinal]);

	const currentType = getCurrentType();

	useEffect(() => {
		if (!eventLoading && currentEvent) {
			setEventName(currentEvent.name);

			// 予選/本選の形式（トーナメントまたはリーグ）を確認
			const teamData = currentEvent.teamData as unknown as TeamData[];

			if (Array.isArray(teamData) && teamData.length > 0) {
				setHasPreliminary(true);
				setPreliminaryType(teamData[0]?.type as "tournament" | "league" | null);
			} else {
				setHasPreliminary(false);
				setPreliminaryType(null);
			}

			if (Array.isArray(teamData) && teamData.length > 1) {
				setHasFinal(true);
				setFinalType(teamData[1]?.type as "tournament" | "league" | null);
			} else {
				setHasFinal(false);
				setFinalType(null);
			}
		}
	}, [currentEvent, eventLoading]);

	// matchPlansのフィルタリングをメモ化
	useEffect(() => {
		if (
			teamData &&
			teamData.type === "tournament" &&
			teamData.matchPlanIdRange
		) {
			const matchPlanIdRange = teamData.matchPlanIdRange;
			const startId = matchPlanIdRange.start;
			const endId = matchPlanIdRange.end;
			const additionalIds = matchPlanIdRange.additional || [];

			// 試合プランのID範囲を使用して関連する試合プランをフィルタリング
			const filteredMatchPlans = matchPlans.filter((matchPlan) => {
				return (
					(matchPlan.id >= startId && matchPlan.id <= endId) ||
					additionalIds.indexOf(matchPlan.id) >= 0
				);
			});
			setRelatedMatchPlans(filteredMatchPlans);
		}
	}, [teamData, matchPlans]);

	// ローディング中の表示
	if (eventLoading || !eventId) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
			</div>
		);
	}

	return (
		<div className="mx-auto px-4 py-4 flex flex-col items-center w-full border-gray-500 border-2 rounded shadow-lg ">
			<h1 className="text-2xl font-bold mb-4 text-gray-800">
				{eventName}
			</h1>

			{/* タブボタン */}
			{(hasPreliminary || hasFinal) && (
				<TabButtons
					hasPreliminary={hasPreliminary}
					hasFinal={hasFinal}
					isFinal={isFinal}
					preliminaryType={preliminaryType}
					finalType={finalType}
					setIsFinal={setIsFinal}
				/>
			)}

			{/* 対戦表コンテンツ */}
			{hasPreliminary || hasFinal ? (
				<div className="bg-background rounded-lg  p-6 pt-2 overflow-x-scroll w-full">
					<Suspense
						fallback={
							<div className="h-40 flex items-center justify-center">
								読み込み中...
							</div>
						}
					>
						{currentType === "tournament" && (
							<TournamentSection
								eventId={eventId}
								isFinal={isFinal}
								relatedMatchPlans={relatedMatchPlans}
								teamIds={teamIds}
							/>
						)}

						{currentType === "league" &&
							teamData?.type === "league" &&
							teamData.blocks && (
								<LeagueSection
									eventId={eventId}
									teamData={teamData}
									teamIds={teamIds}
								/>
							)}
					</Suspense>
				</div>
			) : (
				<div className="bg-background rounded-lg  p-8 text-center">
					<p className="text-gray-500">
						この種目には対戦表データがありません。
					</p>
				</div>
			)}
		</div>
	);
};

export default memo(Bracket);