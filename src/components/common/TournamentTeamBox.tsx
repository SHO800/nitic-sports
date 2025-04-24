import React, {useEffect, useRef, useState} from "react";
import TournamentLine from "@/components/common/TournamentLine";

const TournamentTeamBox = ({displayStr, color}: { displayStr: string, color?: string }) => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [lineCoordinates, setLineCoordinates] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    });
    


    useEffect(() => {
        // 大きさを監視
        const observer = new ResizeObserver(() => {
            if (boxRef.current ) {
                const box = boxRef.current.getBoundingClientRect();
                
                
                const startX = box.width ;
                const endX = box.width + 12;
                const startY = box.height / 2 - 2;
                const endY = box.height / 2 + 2; 

                setLineCoordinates({startX, startY, endX, endY});
            }
        });

        if (boxRef.current) {
            observer.observe(boxRef.current);
        }

        return () => {
            if (boxRef.current) {
                observer.unobserve(boxRef.current);
            }
        };
        
    }, []);
    return (
        <div
            className={`flex justify-between items-center p-2 relative h-10`}
            ref={boxRef}
        >
                          <span className="truncate max-w-[180px]">
            {displayStr}
                          </span>
            {/*<TournamentLine startX={lineCoordinates.startX}*/}
            {/*                startY={lineCoordinates.startY}*/}
            {/*                endX={lineCoordinates.endX}*/}
            {/*                endY={lineCoordinates.endY}*/}
            {/*                isVertical={false}*/}
            {/*                color={color}*/}
            {/*                thickness={2}*/}
            {/*/>*/}
        </div>
    )
}

export default TournamentTeamBox;