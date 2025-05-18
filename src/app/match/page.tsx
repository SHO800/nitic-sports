"use client";

import Clock from "@/components/common/Clock";
import CheckMatchScoresModal from "@/components/match/CheckMatchScoresModal";
import LocationSelector from "@/components/match/LocationSelector";
import MatchesByLocation from "@/components/match/MatchesByLocation";
import { useDataContext } from "@/contexts/dataContext";
import type { Event } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

const MatchDashboard = () => {
	const { events, locations, scores } = useDataContext();
	const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
	const [isShowSelector, setIsShowSelector] = useState<boolean>(true);
	const [isSyncScroll, _setIsSyncScroll] = useState<boolean>(true);
	const [isShowCompletedMatch, setIsShowCompletedMatch] =
		useState<boolean>(false);
	const refs = useRef<HTMLDivElement[]>([]);

	const [scoreUnsettledEvents, setScoreUnsettledEvents] = useState<Event[]>([]);

	const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
		if (!isSyncScroll) {
			return;
		}
		refs.current.forEach((ref) => {
			const refAsDiv = ref as unknown as HTMLDivElement;
			if (refAsDiv !== (event.target as HTMLDivElement))
				refAsDiv.scrollTop = (event.target as HTMLDivElement).scrollTop;
		});
	};

	useEffect(() => {
		if (!events || !scores) return;
		const scoreEventIds = new Set(scores.map((score) => score.eventId));
		const completedEvents = events.filter((event) => event.isCompleted);
		if (completedEvents.length === 0) return;
		const unsettledEvents = completedEvents.filter(
			(event) => !scoreEventIds.has(event.id),
		);
		setScoreUnsettledEvents(unsettledEvents as unknown as Event[]);
	}, [events, scores]);

	return (
		<div className={"relative w-screen h-[calc(100vh-130px)] overflow-hidden"}>
			<div className={"h-fit py-2 flex justify-center items-center relative"}>
				<Clock />

				<div className={"absolute bottom-[calc(50%-1em)] right-0"}>
					<input
						type={"checkbox"}
						onChange={(e) =>
							setIsShowCompletedMatch((e.target as HTMLInputElement).checked)
						}
						checked={isShowCompletedMatch}
						id={"isShowCompletedMatchInput"}
						name={"isShowCompletedMatchInput"}
					/>
					<label htmlFor={"isShowCompletedMatchInput"}>
						完了した試合を表示する
					</label>
				</div>
			</div>
			<LocationSelector
				locations={locations}
				isShowSelector={isShowSelector}
				setIsShowSelector={setIsShowSelector}
				setSelectedLocation={setSelectedLocation}
			/>
			<div
				className={
					"flex flex-row justify-center w-screen h-full px-4 overflow-y-scroll hidden-scrollbar"
				}
			>
				{locations &&
					selectedLocation.map((loc) => {
						return (
							<MatchesByLocation
								key={`loc-list-id-${loc}-len-${selectedLocation.length}`}
								location={
									locations.find((location) => location.id.toString() === loc)!
								}
								onScroll={handleScroll}
								refs={refs}
								isShowCompletedMatch={isShowCompletedMatch}
							/>
						);
					})}
			</div>

			{scoreUnsettledEvents.length !== 0 && events && (
				<CheckMatchScoresModal unSettledEvents={scoreUnsettledEvents} />
			)}
		</div>
	);
};
export default MatchDashboard;
