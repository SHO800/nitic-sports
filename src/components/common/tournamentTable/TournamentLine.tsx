import React from 'react';
import {min} from "@floating-ui/utils";
import {Property} from "csstype";
import AnimationTimingFunction = Property.AnimationTimingFunction;


interface TournamentLineProps {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    type: "H" | "V" | "LT" | "RT" | "LB" | "RB" | "DIRECT";
    color1?: string;
    color2?: string;
    thickness?: number;
    animationTimingFunction?: AnimationTimingFunction
    duration?: number;
    timeout?: number;
}

export const TournamentLine: React.FC<TournamentLineProps> = ({
                                                                  startX,
                                                                  startY,
                                                                  endX,
                                                                  endY,
                                                                  type = 'H',
                                                                  color1 = 'rgba(156, 163, 175, 0.8)',
                                                                  color2 = 'rgba(156, 163, 175, 0.8)',
                                                                  thickness = 2,
                                                                  animationTimingFunction = "linear",
                                                                  duration = 500,
                                                                  timeout = 0

                                                              }) => {

    // 垂直線の場合
    if (type === 'V') {
        return (
            <svg className={"absolute z-10"}
                 width={`${thickness}px`}
                 height={`${Math.abs(endY - startY)}px`}
                 xmlns="http://www.w3.org/2000/svg"
                 style={{
                     left: `${startX}px`,
                     top: `${min(startY, endY)}px`,
                 }}
            >
                <line style={{
                    strokeDasharray: `${Math.abs(endY - startY)}px`,
                    strokeDashoffset: `${Math.abs(endY - startY)}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ${animationTimingFunction} forwards ${timeout}ms`,
                }}
                      x1={0}
                      y1={endY < startY ? startY - endY : 0}
                      x2={0}
                      y2={endY < startY ? 0 : endY - startY}
                      strokeWidth={thickness}
                      stroke={color1}
                />
            </svg>

        );
    }
    // 水平線の場合
    else if (type === 'H') {
        return (
            <svg className={"absolute z-10"}
                 width={`${endX - startX}px`}
                 height={`${endY - startY + thickness}px`}
                 xmlns="http://www.w3.org/2000/svg"
                 style={{
                     left: `${startX}px`,
                     top: `${startY}px`,
                 }}
            >
                <line style={{
                    strokeDasharray: `${endX - startX}px`,
                    strokeDashoffset: `${endX - startX}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ${animationTimingFunction} forwards ${timeout}ms`,
                }}
                      x1={0}
                      y1={0}
                      x2={endX - startX}
                      y2={0}
                      strokeWidth={thickness}
                      stroke={color1}
                />
            </svg>
        );
    }
    // 左上に角がある
    else if (type === 'LT') {
        return (
            <svg className={"absolute z-10"}
                 width={`${endX - startX}px`}
                 height={`${endY - startY}px`}
                 xmlns="http://www.w3.org/2000/svg"
                 style={{
                     left: `${startX}px`,
                     top: `${startY}px`,
                 }}
            >
                <line style={{
                    strokeDasharray: `${endY - startY}px`,
                    strokeDashoffset: `${endY - startY}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ease-in forwards ${timeout}ms`,
                }}
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={endY - startY}
                      strokeWidth={thickness}
                      stroke={color1}
                />
                <line style={{
                    strokeDasharray: `${endX - startX}px`,
                    strokeDashoffset: `${endX - startX}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ease-out forwards ${timeout + duration}ms`,
                }}

                      x1={0}
                      y1={endY - startY}
                      x2={endX - startX}
                      y2={endY - startY}
                      strokeWidth={thickness}
                      stroke={color2}
                />
            </svg>

        );
    }
    // 右上に角がある
    else if (type === 'RT') {
        return (
            <svg className={"absolute z-10"}
                 width={`${endX - startX}px`}
                 height={`${endY - startY}px`}
                 xmlns="http://www.w3.org/2000/svg"
                 style={{
                     left: `${startX}px`,
                     top: `${startY}px`,
                 }}
            >
                <line style={{
                    strokeDasharray: `${endX - startX}px`,
                    strokeDashoffset: `${endX - startX}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ease-in forwards ${timeout}ms`,
                }}
                      x1={0}
                      y1={0}
                      x2={endX - startX}
                      y2={0}
                      strokeWidth={thickness}
                      stroke={color1}
                />
                <line style={{
                    strokeDasharray: `${endY - startY}px`,
                    strokeDashoffset: `${endY - startY}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ease-out forwards ${timeout + duration}ms`,
                }}
                      x1={endX - startX}
                      y1={0}
                      x2={endX - startX}
                      y2={endY - startY}
                      strokeWidth={thickness}
                      stroke={color2}
                />
            </svg>
        );
    }
    // 左下に角がある
    else if (type === 'LB') {
        return (

            <svg className={"absolute z-10"}
                 width={`${endX - startX}px`}
                 height={`${endY - startY}px`}
                 xmlns="http://www.w3.org/2000/svg"
                 style={{
                     left: `${startX}px`,
                     top: `${startY}px`,
                 }}
            >
                <line style={{
                    strokeDasharray: `${endX - startX}px`,
                    strokeDashoffset: `${endX - startX}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ease-in forwards ${timeout}ms`,
                }}
                      x1={0}
                      y1={endY - startY}
                      x2={0}
                      y2={0}
                      strokeWidth={thickness}
                      stroke={color1}
                />
                <line style={{
                    strokeDasharray: `${endY - startY}px`,
                    strokeDashoffset: `${endY - startY}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ease-out forwards ${timeout + duration}ms`,
                }}
                      x1={0}
                      y1={0}
                      x2={endX - startX}
                      y2={0}
                      strokeWidth={thickness}
                      stroke={color2}
                />
            </svg>
        );
    }
    // 右下に角がある
    else if (type === 'RB') {
        return (

            <svg className={"absolute z-10"}
                 width={`${endX - startX}px`}
                 height={`${endY - startY}px`}
                 xmlns="http://www.w3.org/2000/svg"
                 style={{
                     left: `${startX}px`,
                     top: `${startY}px`,
                 }}
            >
                <line style={{
                    strokeDasharray: `${endX - startX}px`,
                    strokeDashoffset: `${endX - startX}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ease-in forwards ${timeout}ms`,
                }}
                      x1={0}
                      y1={endY - startY}
                      x2={endX - startX}
                      y2={endY - startY}
                      strokeWidth={thickness}
                      stroke={color1}
                />
                <line style={{
                    strokeDasharray: `${endY - startY}px`,
                    strokeDashoffset: `${endY - startY}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ease-out forwards ${timeout+duration }ms`,
                }}
                      x1={endX - startX}
                      y1={endY - startY}
                      x2={endX - startX}
                      y2={0}
                      strokeWidth={thickness}
                      stroke={color2}
                />
            </svg>
        );
    } else if (type === 'DIRECT') {
        return (
            <svg className={"absolute z-10"}
                 width={`${endX - startX}px`}
                 height={`${endY - startY}px`}
                 xmlns="http://www.w3.org/2000/svg"
                 style={{
                     left: `${startX}px`,
                     top: `${startY}px`,
                 }}
            >
                <line style={{
                    strokeDasharray: `${Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))}px`,
                    strokeDashoffset: `${Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))}px`,
                    animation: `stroke-dashoffset-animation ${duration}ms ${animationTimingFunction} forwards ${timeout}ms`,
                }}
                      x1={0}
                      y1={0}
                      x2={endX - startX}
                      y2={endY - startY}
                      strokeWidth={thickness}
                      stroke={color2}
                />
            </svg>
        );
    }
    return null; // それ以外のタイプの場合は何も表示しない
};

export default TournamentLine;