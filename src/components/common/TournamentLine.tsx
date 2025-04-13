import React from 'react';

interface TournamentLineProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isVertical?: boolean;
    color?: string;
    thickness?: number;
    ref?: React.RefObject<HTMLDivElement | null>;
}

export const TournamentLine: React.FC<TournamentLineProps> = ({
                                                                  startX,
                                                                  startY,
                                                                  endX,
                                                                  endY,
                                                                  isVertical = false,
                                                                  color = 'rgba(156, 163, 175, 0.8)',
                                                                  thickness = 2,
                                                                  ref

                                                              }) => {
    // 垂直線の場合
    if (isVertical) {
        return (
            <div
                className="absolute z-10"
                ref={ref}
                style={{
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${thickness}px`,
                    height: `${endY - startY}px`,
                    backgroundColor: color
                }}
            />
        );
    }

    // 水平線の場合
    return (
        <div
            className="absolute z-40"
            ref={ref}
            style={{
                left: `${startX}px`,
                top: `${startY}px`,
                width: `${endX - startX}px`,
                height: `${thickness}px`,
                backgroundColor: color
            }}
        />
    );
};

export default TournamentLine;