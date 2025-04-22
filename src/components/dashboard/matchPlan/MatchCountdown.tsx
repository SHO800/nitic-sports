"use client"
import {useCurrentTime} from "@/hooks/currenTime";

type MatchCountdownProps = {
    scheduledStartTime: Date | string;
};

const MatchCountdown = ({scheduledStartTime}: MatchCountdownProps) => {
    const {formatTimeDifference, currentTime} = useCurrentTime();
    
    const {str, isPast, waiting} = formatTimeDifference(scheduledStartTime)
    
    
    return (
        <div className="text-black">
            {/* 開始時間が過ぎている場合は赤色で表示 */}
            {isPast ? (
                <p className="text-red-500">
                    {new Date(currentTime).toLocaleString()} 遅延: {str}
                </p>
            ) : (
                <p className="text-green-800">
                    {new Date(currentTime).toLocaleString()} 開始予定時刻まで: {str}
                    {
                        waiting &&  <span className={"ml-1 text-sm"}>応答待機中 (最大1分)</span> 
                    }
                </p>
            )}
            
        </div>
    );
};

export default MatchCountdown;
