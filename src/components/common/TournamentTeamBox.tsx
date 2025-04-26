import React, {useEffect, useRef, useState} from "react";
import TournamentLine from "@/components/common/TournamentLine";

const TournamentTeamBox = ({isFinal, displayStr, boxLength, boxIndex, roundNumber, isWon}: {
    isFinal: boolean,
    displayStr: string,
    boxLength: number,
    boxIndex: number,
    roundNumber: number,
    isWon: boolean,
}) => {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [lineData, setlineData] = useState({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        type: "H" as "H" | "V" | "LT" | "RT" | "LB" | "RB",
    });


    useEffect(() => {
        // 大きさを監視
        const observer = new ResizeObserver(() => {
            if (boxRef.current) {
                const box = boxRef.current.getBoundingClientRect();

                const startX = box.width;
                const endX = box.width + 12;
                let startY = 0;
                let endY = 0;
                let type = "H" as "H" | "V" | "LT" | "RT" | "LB" | "RB";

                const isUpperHalf = boxIndex < boxLength / 2; // そのチーム名表示場所が上半分か下半分かを判定
                if (isUpperHalf) {
                    startY = box.height / 2 - 2;
                    endY = box.height;
                    type = "RT";
                } else {
                    // startY = 0;
                    endY = box.height / 2 + 2;
                    type = "RB";
                }

                setlineData({startX, startY, endX, endY, type});
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

    }, [boxIndex, boxLength]);
    return (
        <div
            className={`flex justify-between items-center p-2 relative h-10`}
            ref={boxRef}
        >
            <span className="truncate max-w-[180px]">{displayStr}</span>
            {
                !isFinal &&
            <TournamentLine startX={lineData.startX}
                            startY={lineData.startY}
                            endX={lineData.endX}
                            endY={lineData.endY}
                            type={lineData.type}
                            color={isWon? "rgb(255,0,0)": "rgba(156, 163, 175, 1)"}
                            thickness={4}
                            duration={200}
                            timeout={(roundNumber-1) * 1000}
            />
            }
            
        </div>
    )
}

export default TournamentTeamBox;