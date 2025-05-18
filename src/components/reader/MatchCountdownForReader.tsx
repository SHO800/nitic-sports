"use client";
import { useCurrentTime } from "@/hooks/currentTime";

type MatchCountdownProps = {
	scheduledStartTime: Date | string;
};

const MatchCountdownForReader = ({
	scheduledStartTime,
}: MatchCountdownProps) => {
	const { formatTimeDifference } = useCurrentTime();

	const { str, isPast, waiting } = formatTimeDifference(scheduledStartTime);

	return (
		<div className="text-black">
			{/* 開始時間が過ぎている場合は赤色で表示 */}
			{isPast ? (
				<p className="text-red-500 text-[20px]">{str} 遅延しています</p>
			) : (
				<p className="text-green-800 text-[20px]">
					{str} 後に開始予定です
					{waiting && (
						<span className={"ml-1 text-sm"}>応答待機中 (最大3分)</span>
					)}
				</p>
			)}
		</div>
	);
};

export default MatchCountdownForReader;
