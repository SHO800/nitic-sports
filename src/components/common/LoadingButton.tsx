
import {ReactNode} from "react";
const LoadingButton = ({children, onClick, bgColor, textColor = "white", isLoading}: {children: ReactNode, onClick: () => void, bgColor: string, textColor: string, isLoading}) => {
    
    return (
        <button className={"rounded w-32 h-8 block z-50 top-20 "} style={isLoading ? {color: "white",  backgroundColor: "gray"} : {color: textColor, backgroundColor: bgColor}} onClick={onClick} disabled={isLoading}>
            {children}
        </button>
    )
}
export default LoadingButton;