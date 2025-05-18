import { Property } from "csstype";
import { useCallback, useEffect, useRef, useState } from "react";
import AnimationTimingFunction = Property.AnimationTimingFunction;

export type LineType = "H" | "V" | "LT" | "RT" | "LB" | "RB" | "DIRECT";

export interface LineCoordinates {
	startX: number;
	startY: number;
	endX: number;
	endY: number;
	type: LineType;
}

export const useTournamentLine = (
	rowWidth: number,
	rowHeight: number,
	currentRow: number,
	currentColumn: number,
	nextRow: number | undefined,
	nextColumn: number | undefined,
) => {
	const boxRef = useRef<HTMLDivElement | null>(null);
	const [lineCoords, setLineCoords] = useState<LineCoordinates>({
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
		type: "H",
	});

	const calculateLineCoordinates = useCallback(() => {
		if (!boxRef.current || nextRow === undefined || nextColumn === undefined)
			return;

		const box = boxRef.current.getBoundingClientRect();
		const rowDiff = nextRow - currentRow;
		const colDiff = nextColumn - currentColumn;

		if (currentColumn === 0) {
			let startX = box.width;
			const endX = box.width + (colDiff - 1) * rowWidth;
			let startY = box.height / 2;
			let endY = box.height / 2;
			let type = "H" as "H" | "V" | "LT" | "RT" | "LB" | "RB";

			if (rowDiff > 0) {
				endY += rowDiff * rowHeight - 4;
				type = "RT";
			} else if (rowDiff < 0) {
				startY += rowDiff * rowHeight - 6;
				endY += 4;
				type = "RB";
			} else {
				startY--;
				startX--;
				type = "H";
			}

			setLineCoords({ startX, startY, endX, endY, type });
		} else {
			const startX = box.width;
			const endX = box.width + colDiff * rowWidth;
			let startY = box.height / 2;
			let endY = box.height / 2;
			let type: "H" | "V" | "LT" | "RT" | "LB" | "RB";

			if (rowDiff > 0) {
				startY = box.height / 2;
				endY = box.height / 2 + rowDiff * rowHeight;
				type = "RT";
			} else if (rowDiff < 0) {
				startY = box.height / 2 + rowDiff * rowHeight;
				endY = box.height / 2;
				type = "RB";
			} else {
				type = "H";
			}
			setLineCoords({ startX, startY, endX, endY, type });
		}
	}, [currentColumn, currentRow, nextColumn, nextRow, rowHeight, rowWidth]);

	useEffect(() => {
		const observer = new ResizeObserver(() => {
			calculateLineCoordinates();
		});

		if (boxRef.current) {
			calculateLineCoordinates();
			observer.observe(boxRef.current);
		}

		return () => {
			if (boxRef.current) {
				observer.unobserve(boxRef.current);
			}
		};
	}, [calculateLineCoordinates]);

	return { boxRef, lineCoords };
};

export interface AnimationOptions {
	color1?: string;
	color2?: string;
	thickness?: number;
	animationTimingFunction?: AnimationTimingFunction;
	duration?: number;
	timeout?: number;
}

export default useTournamentLine;
