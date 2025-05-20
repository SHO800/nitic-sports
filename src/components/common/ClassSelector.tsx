import { useDataContext } from "@/contexts/dataContext";
import { useState } from "react";

interface ClassSelectorProps {
	groupedData: Record<string, { id: number; name: string }[]>;
	callback?: (id: string, name: string) => void;
	isShowVariableId: boolean
}

const ClassSelector = ({ groupedData, callback, isShowVariableId = false}: ClassSelectorProps) => {
	const { getMatchDisplayStr } = useDataContext();

	const [variableType, setVariableType] = useState<"T" | "L" | null>(null);

	// $<T(ournament)-[matchId]-[W|L] | L(eague)-[eventId]-[teamDataでのindex(0なら予選, 1なら本選)]-[blockName]-[rank]>
	// トーナメントを選択して決定された場合のコールバック
	const handleTournamentSelect = () => {
		const matchId = (
			document.getElementById(
				"classSelector-tournament-matchId",
			) as HTMLInputElement
		).value;
		const winner = (
			document.getElementById(
				"classSelector-tournament-winner",
			) as HTMLInputElement
		).checked;

		const result = `$T-${matchId}-${winner ? "W" : "L"}`;

		if (callback) {
			callback(result, getMatchDisplayStr(result));
		}
	};

	const handleLeagueSelect = () => {
		const eventId = (
			document.getElementById(
				"classSelector-league-eventId",
			) as HTMLInputElement
		).value;
		const teamIndex = (
			document.getElementById(
				"classSelector-league-qualifying",
			) as HTMLInputElement
		).checked
			? 0
			: 1;
		const blockName = (
			document.getElementById(
				"classSelector-league-blockName",
			) as HTMLInputElement
		).value;
		const rank = (
			document.getElementById("classSelector-league-rank") as HTMLInputElement
		).value;

		const result = `$L-${eventId}-${teamIndex}-${blockName}-${rank}`;
		console.log(result);

		if (callback) {
			callback(result, getMatchDisplayStr(result));
		}
	};

	return (
		<div
			className={
				"relative top-24 left-0 w-fit h-fit px-1 bg-gray-800 bg-opacity-50 z-50 flex flex-col items-center justify-between"
			}
		>
			{groupedData ? (
				<table>
					<tbody>
						{Object.keys(groupedData).map((key) => (
							<tr key={key} className={"border-y-[1px] border-white"}>
								<td className="text-center text-2xl font-bold pr-2 text-white">
									{key}
								</td>
								{groupedData[key].map((data) => (
									<td key={data.id} className="text-center text-lg font-bold">
										<button
											className={
												"bg-gray-200 w-18 m-1 hover:bg-gray-300 active:bg-gray-400 text-black px-4 py-2 rounded"
											}
											onClick={(e) => {
												e.preventDefault();
												if (callback) {
													callback(String(data.id), data.name);
												}
											}}
										>
											{data.name}
										</button>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<div className="text-center text-2xl font-bold">読み込み中...</div>
			)}
			{isShowVariableId &&
                <div className="text-center mt-4">
                    {/*変数を使用するか*/}
                    <input
                        type="checkbox"
                        id="variableType"
                        onChange={(e) => {
                            if (e.target.checked) {
                                setVariableType("T");
                            } else {
                                setVariableType(null);
                            }
                        }}
                    />
                    <label htmlFor="variableType" className="text-white cursor-pointer">
                        変数を使用
                    </label>
                </div>
            }
			{variableType !== null && (
				<div
					className={
						"mt-2 text-white text-center flex flex-col items-center justify-start w-full"
					}
				>
					<div className={"flex flex-row items-center justify-around w-full"}>
						<div>
							<input
								type="radio"
								name="variableType"
								value="T"
								id="T"
								defaultChecked={variableType === "T"}
								onChange={(e) => {
									setVariableType(e.target.value as "T" | "L");
								}}
							/>
							<label htmlFor="T" className="ml-2">
								トーナメント
							</label>
						</div>
						<div>
							<input
								type="radio"
								name="variableType"
								value="L"
								id="L"
								className={"ml-4"}
								onChange={(e) => {
									setVariableType(e.target.value as "T" | "L");
								}}
							/>
							<label htmlFor="L" className="ml-2">
								リーグ
							</label>
						</div>
					</div>
					{variableType === "T" ? (
						<div className="text-center">
							{/*試合id*/}
							<div>
								<label htmlFor="" className="ml-2">
									試合ID
								</label>
								<input
									type="text"
									placeholder="試合ID"
									id="classSelector-tournament-matchId"
									className="text-black w-32 m-1 p-1 rounded bg-white border-2 border-gray-300"
								/>
							</div>
							{/*    勝者か敗者か*/}
							<div>
								<p className={"text-white"}>条件</p>
								<div
									className={"flex flex-row items-center justify-around w-full"}
								>
									<div>
										<input
											type="radio"
											name="matchCondition"
											value="winner"
											id="classSelector-tournament-winner"
											defaultChecked={true}
										/>
										<label
											htmlFor={"classSelector-tournament-winner"}
											className=""
										>
											{" "}
											勝者
										</label>
									</div>
									<div>
										<input
											type="radio"
											name="matchCondition"
											value="loser"
											id="classSelector-tournament-loser"
										/>
										<label
											htmlFor={"classSelector-tournament-loser"}
											className=""
										>
											{" "}
											敗者
										</label>
									</div>
								</div>
							</div>
							{/*    決定*/}
							<button
								className={
									"bg-gray-200 w-18 m-1 hover:bg-gray-300 active:bg-gray-400 text-black px-4 py-2 rounded"
								}
								onClick={(e) => {
									e.preventDefault();
									handleTournamentSelect();
								}}
							>
								決定
							</button>
						</div>
					) : (
						<div className="text-center">
							{/*競技ID*/}
							<div>
								<label htmlFor="classSelector-league-eventId" className="ml-2">
									競技ID
								</label>
								<input
									type="text"
									placeholder="イベントID"
									id="classSelector-league-eventId"
									className="text-black w-32 m-1 p-1 rounded bg-white border-2 border-gray-300"
								/>
							</div>
							{/*予選か本選*/}
							<div>
								<p className="ml-2">予選/本選</p>
								<div className="flex flex-row items-center justify-around w-full">
									<div>
										<input
											type="radio"
											name="leagueType"
											value="0"
											id="classSelector-league-qualifying"
											defaultChecked={true}
										/>
										<label htmlFor={"classSelector-league-qualifying"}>
											{" "}
											予選
										</label>
									</div>
									<div>
										<input
											type="radio"
											name="leagueType"
											value="1"
											id="classSelector-league-final"
										/>
										<label htmlFor={"classSelector-league-final"}> 本選</label>
									</div>
								</div>
								{/*ブロック名*/}
								<div>
									<label
										htmlFor="classSelector-league-blockName"
										className="ml-2"
									>
										ブロック名
									</label>
									<input
										type="text"
										placeholder="ブロック名"
										id="classSelector-league-blockName"
										className="text-black w-32 m-1 p-1 rounded bg-white border-2 border-gray-300"
									/>
								</div>
								{/*順位*/}
								<div>
									<label htmlFor="classSelector-league-rank" className="ml-2">
										順位
									</label>
									<input
										type="text"
										placeholder="ランク"
										id="classSelector-league-rank"
										className="text-black w-32 m-1 p-1 rounded bg-white border-2 border-gray-300"
									/>
								</div>
								{/*    決定*/}
								<button
									className={
										"bg-gray-200 w-18 m-1 hover:bg-gray-300 active:bg-gray-400 text-black px-4 py-2 rounded"
									}
									onClick={(e) => {
										e.preventDefault();
										handleLeagueSelect();
									}}
								>
									決定
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
export default ClassSelector;
