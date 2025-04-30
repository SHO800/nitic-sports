"use client"
import {useCurrentTime} from "@/hooks/currenTime";

type MatchCountdownProps = {
    scheduledStartTime: Date | string;
};

const MatchCountdownForMap = ({scheduledStartTime}: MatchCountdownProps) => {
    const {formatTimeDifference} = useCurrentTime();
    
    const {str, isPast} = formatTimeDifference(scheduledStartTime)
    
    
    return (
        <div className="text-black">
            {/* 開始時間が過ぎている場合は赤色で表示 */}
            {isPast ? (
                <p className="text-red-500">
                    遅延: {str}
                </p>
            ) : null
            }
            
        </div>
    );
};

export default MatchCountdownForMap;
