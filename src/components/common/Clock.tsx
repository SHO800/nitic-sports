"use client"

import {useCurrentTimeContext} from "@/contexts/currentTimeContext";


const Clock = () => {
    const {currentTime} = useCurrentTimeContext();

    return (
        <div
            suppressHydrationWarning={true}
            className={`text-5xl font-extrabold text-center`}
        > {/* Dateを使う都合上か必ずサーバーとずれるのでsuppressHydrationWarningで封じる */}
            {currentTime.toLocaleTimeString()}
        </div>
    )
}


export default Clock
