"use client"

import {createContext, ReactNode, useContext} from "react";
import {useCurrentTime} from "@/hooks/currentTime";

type CurrentTimeContextType = {
    addCallBack: (callback: (currentTime: Date) => void) => void
    removeCallBack: (callback: (currentTime: Date) => void) => void
    currentTime: Date
    formatTimeDifference: (targetTime: (Date | string)) => {
        str: string
        diff: number
        isPast: boolean
        waiting: boolean
    }

}

export const CurrentTimeContext = createContext<CurrentTimeContextType | null>(null)
export const useCurrentTimeContext = () => {
    const context = useContext(CurrentTimeContext)
    if (!context) {
        throw new Error('useCurrentTimeContext must be used within a CurrentTimeContextProvider')
    }

    return {...context}
}


export const CurrentTimeContextProvider = ({children}: { children: ReactNode }) => {
    return <CurrentTimeContext.Provider value={useCurrentTime()}>{children}</CurrentTimeContext.Provider>
}