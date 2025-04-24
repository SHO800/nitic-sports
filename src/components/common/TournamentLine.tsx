import React from 'react';

interface TournamentLineProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    type: "H" | "V" | "LT" | "RT" | "LB" | "RB" ;
    color?: string;
    thickness?: number;
    ref?: React.RefObject<HTMLDivElement | null>;
}

export const TournamentLine: React.FC<TournamentLineProps> = ({
                                                                  startX,
                                                                  startY,
                                                                  endX,
                                                                  endY,
                                                                  type = 'H',
                                                                  color = 'rgba(156, 163, 175, 0.8)',
                                                                  thickness = 2,
                                                                  ref

                                                              }) => {
    // 垂直線の場合
    if (type === 'V') {
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
    else if (type === 'H') {
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
    }
    // 左上に角がある
    else if (type === 'LT') {
        return (
            <div
                className="absolute z-10"
                ref={ref}
                style={{
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${endX - startX}px`,
                    height: `${thickness}px`,
                    backgroundColor: color,
                    borderTopLeftRadius: '10px'
                }}
            />
        );
    }
    // 右上に角がある
    else if (type === 'RT') {
        return (
            <div
                className="absolute z-10"
                ref={ref}
                style={{
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${endX - startX}px`,
                    height: `${endY - startY}px`,
                    backgroundColor: color,
                    
                    
                }}
            />
        );
    }
    // 左下に角がある
    else if (type === 'LB') {
        return (
            <div
                className="absolute z-10"
                ref={ref}
                style={{
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${endX - startX}px`,
                    height: `${thickness}px`,
                    backgroundColor: color,
                    borderBottomLeftRadius: '10px'
                }}
            />
        );
    }
    // 右下に角がある
    else if (type === 'RB') {
        return (
            <div
                className="absolute z-10"
                ref={ref}
                style={{
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${endX - startX}px`,
                    height: `${thickness}px`,
                    backgroundColor: color,
                    borderBottomRightRadius: '10px'
                }}
            />
        );
    }
    return null; // それ以外のタイプの場合は何も表示しない
};

export default TournamentLine;