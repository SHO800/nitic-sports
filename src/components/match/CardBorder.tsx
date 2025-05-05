import {memo, ReactNode, useMemo} from "react";
import {Status} from "@prisma/client";
import {useCurrentTimeContext} from "@/contexts/currentTimeContext";

const CardBorder = memo(function CardBorder({children, scheduledStartTime, status}: {
    children: ReactNode,
    scheduledStartTime: Date,
    status: Status
}) {
    const {currentTime} = useCurrentTimeContext();

    const frameClass = useMemo(() => {
        if (status === Status.Preparing && new Date(scheduledStartTime).getTime() - currentTime.getTime() < 1000 * 60 * 5) { // 5分以内に開始する
            return "card-blue"
        } else if (status === Status.Playing) {
            return "card-green"
        } else if (status === Status.Finished) {
            return "card-yellow "
        } else if (status === Status.Completed || status === Status.Cancelled) {
            return "card-gray"
        }
        return ""
    }, [currentTime, scheduledStartTime, status])

    return (
        <div className={"w-full  px-4 py-2 outline-2 outline-offset-4 outline-gray-400 rounded-xs " + frameClass}>
            {children}
        </div>
    )
},)

export default CardBorder;