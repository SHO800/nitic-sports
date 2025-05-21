"use client";
import { memo, useEffect, useState } from "react";

type Props = {
	selectedId: number | "all";
	setSelectedId: (id: number | "all") => void;
	isAllDay?: boolean
};

const EventSwitch = ({ selectedId, setSelectedId, isAllDay = false }: Props) => {
	
	const [today, setToday] = useState<number>(0);

	useEffect(() => {
		const currentDate = new Date();
		setToday(currentDate.getDate());
	}, []);

	return (
		<div className="flex flex-row px-[2px] justify-center ">
			{isAllDay &&
			<>
				<button
					onClick={() => setSelectedId("all")}
					className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
				>
					全競技
				</button>
				<button
					onClick={() => setSelectedId(1)}
					className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
				>
					バド
				</button>
				{/* <button onClick={() => setSelectedId(2)} className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}>卓球</button> */}
				<button
					onClick={() => setSelectedId(3)}
					className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
				>
					バレー
				</button>
				{/* <button onClick={() => setSelectedId(4)} className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 4 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}>バスケ</button> */}
				<button
					onClick={() => setSelectedId(5)}
					className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 5 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
				>
					テニス
				</button>
				<button
					onClick={() => setSelectedId(6)}
					className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 6 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
				>
					ソフト
				</button>
				<button
					onClick={() => setSelectedId(7)}
					className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 7 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
				>
					サッカー
				</button>
				<button
					onClick={() => setSelectedId(2)}
					className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
				>
					卓球
				</button>
				{/* <button onClick={() => setSelectedId(3)} className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}>バレー</button> */}
				<button
					onClick={() => setSelectedId(4)}
					className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 4 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
				>
					バスケ
				</button>
				
				<button
					onClick={() => setSelectedId(8)}
					className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 8 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
				>
					リレー
				</button>
				{/* <button onClick={() => setSelectedId(8)} className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 8 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}>リレー</button> */}
				
			</>	
			}
			{!isAllDay && today <= 22 && (
				<>
					<button
						onClick={() => setSelectedId("all")}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						全競技
					</button>
					<button
						onClick={() => setSelectedId(1)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						バド
					</button>
					{/* <button onClick={() => setSelectedId(2)} className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}>卓球</button> */}
					<button
						onClick={() => setSelectedId(3)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						バレー
					</button>
					{/* <button onClick={() => setSelectedId(4)} className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 4 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}>バスケ</button> */}
					<button
						onClick={() => setSelectedId(5)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 5 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						テニス
					</button>
					<button
						onClick={() => setSelectedId(6)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 6 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						ソフト
					</button>
					<button
						onClick={() => setSelectedId(7)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 7 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						サッカー
					</button>
					{/* <button onClick={() => setSelectedId(8)} className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 8 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}>リレー</button> */}
					
				</>
			)}
			{!isAllDay && today >= 23 && (
				<>
					<button
						onClick={() => setSelectedId("all")}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						全競技
					</button>
					{/* <button onClick={() => setSelectedId(1)} className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}>バド</button> */}
					<button
						onClick={() => setSelectedId(2)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						卓球
					</button>
					{/* <button onClick={() => setSelectedId(3)} className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}>バレー</button> */}
					<button
						onClick={() => setSelectedId(4)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 4 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						バスケ
					</button>
					<button
						onClick={() => setSelectedId(5)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 5 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						テニス
					</button>
					<button
						onClick={() => setSelectedId(6)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 6 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						ソフト
					</button>
					<button
						onClick={() => setSelectedId(7)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 7 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						サッカー
					</button>
					<button
						onClick={() => setSelectedId(8)}
						className={`text-sm rounded shadow-md mx-0.5 px-1 py-0.5 [writing-mode:vertical-rl] my-1 ${selectedId === 8 ? "bg-blue-600 text-white" : "bg-gray-200 text-black "}`}
					>
						リレー
					</button>
				</>
			)}
		</div>
	);
};

export default memo(EventSwitch);
