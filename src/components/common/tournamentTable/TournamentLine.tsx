import { min } from "@floating-ui/utils";
import { Property } from "csstype";
import type React from "react";
import { memo, useMemo } from "react";
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
	animationTimingFunction?: AnimationTimingFunction;
	duration?: number;
	timeout?: number;
}

// 線の描画関数をタイプごとに分離
const TournamentLine: React.FC<TournamentLineProps> = ({
	startX,
	startY,
	endX,
	endY,
	type = "H",
	color1 = "rgba(156, 163, 175, 0.8)",
	color2 = "rgba(156, 163, 175, 0.8)",
	thickness = 2,
	animationTimingFunction = "linear",
	duration = 500,
	timeout = 0,
}) => {
	// 線の描画スタイルをメモ化
	const lineStyle = useMemo(() => {
		const baseStyle = {
			strokeDasharray: "0",
			strokeDashoffset: "0",
			animation: `stroke-dashoffset-animation ${duration}ms ${animationTimingFunction} forwards ${timeout}ms`,
		};

		if (type === "H") {
			return {
				...baseStyle,
				strokeDasharray: `${endX - startX}px`,
				strokeDashoffset: `${endX - startX}px`,
			};
		} else if (type === "V") {
			return {
				...baseStyle,
				strokeDasharray: `${Math.abs(endY - startY)}px`,
				strokeDashoffset: `${Math.abs(endY - startY)}px`,
			};
		} else if (["LT", "RT", "LB", "RB"].includes(type)) {
			// 角がある線は2本に分けるため、スタイルは別々に適用
			return baseStyle;
		} else if (type === "DIRECT") {
			const length = Math.sqrt(
				Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2),
			);
			return {
				...baseStyle,
				strokeDasharray: `${length}px`,
				strokeDashoffset: `${length}px`,
			};
		}

		return baseStyle;
	}, [
		type,
		startX,
		startY,
		endX,
		endY,
		duration,
		animationTimingFunction,
		timeout,
	]);

	// SVGの寸法と位置をメモ化
	const svgProps = useMemo(() => {
		if (type === "V") {
			return {
				width: `${thickness}px`,
				height: `${Math.abs(endY - startY)}px`,
				style: {
					left: `${startX}px`,
					top: `${min(startY, endY)}px`,
				},
			};
		} else if (type === "H") {
			return {
				width: `${endX - startX}px`,
				height: `${endY - startY + thickness}px`,
				style: {
					left: `${startX}px`,
					top: `${startY}px`,
				},
			};
		} else if (["LT", "RT", "LB", "RB", "DIRECT"].includes(type)) {
			return {
				width: `${endX - startX}px`,
				height: `${Math.abs(endY - startY)}px`,
				style: {
					left: `${startX}px`,
					top: `${startY}px`,
				},
			};
		}

		// デフォルト値
		return {
			width: "0",
			height: "0",
			style: {},
		};
	}, [type, startX, startY, endX, endY, thickness]);

	if (type === "V") {
		return (
			<svg
				className="absolute z-10"
				width={svgProps.width}
				height={svgProps.height}
				xmlns="http://www.w3.org/2000/svg"
				style={svgProps.style}
			>
				<line
					style={lineStyle}
					x1={0}
					y1={endY < startY ? startY - endY : 0}
					x2={0}
					y2={endY < startY ? 0 : endY - startY}
					strokeWidth={thickness}
					stroke={color1}
				/>
			</svg>
		);
	} else if (type === "H") {
		return (
			<svg
				className="absolute z-10"
				width={svgProps.width}
				height={svgProps.height}
				xmlns="http://www.w3.org/2000/svg"
				style={svgProps.style}
			>
				<line
					style={lineStyle}
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
	// 以下、角のある線は共通コンポーネントに変更
	else if (type === "LT") {
		return (
			<CornerLine
				svgProps={svgProps}
				lineStyle={lineStyle}
				thickness={thickness}
				color1={color1}
				color2={color2}
				duration={duration}
				timeout={timeout}
				line1={{ x1: 0, y1: 0, x2: 0, y2: endY - startY }}
				line2={{
					x1: 0,
					y1: endY - startY,
					x2: endX - startX,
					y2: endY - startY,
				}}
			/>
		);
	} else if (type === "RT") {
		return (
			<CornerLine
				svgProps={svgProps}
				lineStyle={lineStyle}
				thickness={thickness}
				color1={color1}
				color2={color2}
				duration={duration}
				timeout={timeout}
				line1={{ x1: 0, y1: 0, x2: endX - startX, y2: 0 }}
				line2={{
					x1: endX - startX,
					y1: 0,
					x2: endX - startX,
					y2: endY - startY,
				}}
			/>
		);
	} else if (type === "LB") {
		return (
			<CornerLine
				svgProps={svgProps}
				lineStyle={lineStyle}
				thickness={thickness}
				color1={color1}
				color2={color2}
				duration={duration}
				timeout={timeout}
				line1={{ x1: 0, y1: endY - startY, x2: 0, y2: 0 }}
				line2={{ x1: 0, y1: 0, x2: endX - startX, y2: 0 }}
			/>
		);
	} else if (type === "RB") {
		return (
			<CornerLine
				svgProps={svgProps}
				lineStyle={lineStyle}
				thickness={thickness}
				color1={color1}
				color2={color2}
				duration={duration}
				timeout={timeout}
				line1={{
					x1: 0,
					y1: endY - startY,
					x2: endX - startX,
					y2: endY - startY,
				}}
				line2={{
					x1: endX - startX,
					y1: endY - startY,
					x2: endX - startX,
					y2: 0,
				}}
			/>
		);
	} else if (type === "DIRECT") {
		return (
			<svg
				className="absolute z-10"
				width={svgProps.width}
				height={svgProps.height}
				xmlns="http://www.w3.org/2000/svg"
				style={svgProps.style}
			>
				<line
					style={lineStyle}
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

	return null;
};

// 角のある線用のサブコンポーネント
interface CornerLineProps {
	svgProps: { width: string; height: string; style: React.CSSProperties };
	lineStyle: React.CSSProperties;
	thickness: number;
	color1: string;
	color2: string;
	duration: number;
	timeout: number;
	line1: { x1: number; y1: number; x2: number; y2: number };
	line2: { x1: number; y1: number; x2: number; y2: number };
}

const CornerLine: React.FC<CornerLineProps> = ({
	svgProps,
	lineStyle,
	thickness,
	color1,
	color2,
	duration,
	timeout,
	line1,
	line2,
}) => {
	// 1本目の線の長さを計算
	const line1Length = Math.sqrt(
		Math.pow(line1.x2 - line1.x1, 2) + Math.pow(line1.y2 - line1.y1, 2),
	);

	// 2本目の線の長さを計算
	const line2Length = Math.sqrt(
		Math.pow(line2.x2 - line2.x1, 2) + Math.pow(line2.y2 - line2.y1, 2),
	);

	return (
		<svg
			className="absolute z-10"
			width={svgProps.width}
			height={svgProps.height}
			xmlns="http://www.w3.org/2000/svg"
			style={svgProps.style}
		>
			<line
				style={{
					...lineStyle,
					strokeDasharray: `${line1Length}px`,
					strokeDashoffset: `${line1Length}px`,
					animation: `stroke-dashoffset-animation ${duration}ms ease-in forwards ${timeout}ms`,
				}}
				x1={line1.x1}
				y1={line1.y1}
				x2={line1.x2}
				y2={line1.y2}
				strokeWidth={thickness}
				stroke={color1}
			/>
			<line
				style={{
					...lineStyle,
					strokeDasharray: `${line2Length}px`,
					strokeDashoffset: `${line2Length}px`,
					animation: `stroke-dashoffset-animation ${duration}ms ease-out forwards ${timeout + duration}ms`,
				}}
				x1={line2.x1}
				y1={line2.y1}
				x2={line2.x2}
				y2={line2.y2}
				strokeWidth={thickness}
				stroke={color2}
			/>
		</svg>
	);
};

export default memo(TournamentLine);
