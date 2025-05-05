"use client"
import {useCurrentTimeContext} from "@/contexts/currentTimeContext";

type MatchCountdownProps = {
    scheduledStartTime: Date | string;
};

const MatchCountdownForReader = ({scheduledStartTime}: MatchCountdownProps) => {
    const {formatTimeDifference} = useCurrentTimeContext();

    const {str, isPast, waiting} = formatTimeDifference(scheduledStartTime)


    return (
        <div className="text-black">
            {/* 開始時間が過ぎている場合は赤色で表示 */}
            {isPast ? (
                <p className="text-red-500">
                    遅延: {str}
                </p>
            ) : (
                <p className="text-green-800">
                    あと {str} で開始
                    {
                        waiting && <span className={"ml-1 text-sm"}>応答待機中 (最大3分)</span>
                    }
                </p>
            )}

        </div>
    );
};

export default MatchCountdownForReader;
