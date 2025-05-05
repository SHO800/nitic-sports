"use client"
import {useCurrentTime} from "@/hooks/currenTime";

type MatchCountdownProps = {
    scheduledStartTime: Date | string;
};

const MatchCountdown = ({scheduledStartTime}: MatchCountdownProps) => {
    const {formatTimeDifference} = useCurrentTime();
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
                    {str} 後
                    {
                        waiting &&  <span className={"ml-1 text-sm"}>応答待機中 (最大1分)</span> 
                    }
                </p>
            )}
            
        </div>
    );
};

export default MatchCountdown;
