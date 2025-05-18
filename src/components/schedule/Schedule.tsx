"use server";
import Image from "next/image";

const Schedule = async () => {
	// ここに試合情報をgetするやつ

	return (
		<>
			<h1 className="flex font-bold text-2xl mt-4 ml-8 bg-white">
				体育大会スケジュール
			</h1>
			<div className=" w-max-full overflow-auto">
				<div
					className={
						"relative h-[1024px] w-auto aspect-[0.7072135785] bg-white"
					}
				>
					<Image
						src="/schedule1.png"
						alt="hero"
						fill={true}
						priority={true}
						sizes="100vh"
						quality={100}
						className="object-cover aspect-[0.7072135785] !h-full !w-auto"
					/>
					<div className="absolute z-100 h-[1024px] w-full"></div>
				</div>
			</div>
			<div
				className={"absolute top-0 left-0 w-full h-full pt-[100px] pb-[77px]"}
			>
				{/*もしstartTime < 今 < endTimeなら*/}

				{/* <TimeLine startTime={"2025/04/29 08:25"} endTime={"2025/04/ 17:35"}/> */}
				{/*<TimeLine startTime={new Date(Date.now())} endTime={new Date(Date.now() + 360000)}/>*/}
			</div>
		</>
	);
};

export default Schedule;
