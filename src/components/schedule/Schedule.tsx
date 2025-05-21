"use server";
import Image from "next/image";
import TimeLine from "@/components/schedule/TimeLine";

const Schedule = async () => {
    

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <h1 className="flex justify-center mx-2 my-1 font-bold text-4xl mt-8">
                体育大会スケジュール
            </h1>
            <h2 className="flex justify-center mx-2 mt-6 mb-4  text-2xl ">
                1日目 (2025/05/22)
            </h2>
            <div
                className={
                    "relative max-w-[1024px] w-full h-auto  aspect-[0.5878481013] "
                }
            >
                <Image
                    src="/schedule1.png"
                    alt="day1-sunny-schedule"
                    fill={true}
                    priority={true}
                    sizes="1024px"
                    quality={100}
                    className="object-cover aspect-[0.5878481013] !h-full !w-auto"
                />
                <div className="absolute z-80 bottom-0  left-0 w-full h-[calc(100%-0.0263291139%)] ">
                    <TimeLine startTime={"2025/05/22 09:29"} endTime={"2025/05/22 18:35"}/>
                </div>
            </div>
            <h2 className="flex justify-center mx-2 mt-8 mb-4  text-2xl ">
                2日目 (2025/05/23)
            </h2>
            <div
                className={
                    "relative  max-w-[1024px] w-full h-auto  aspect-[0.5389884089] "
                }
            >
                <Image
                    src="/schedule2.png"
                    alt="day1-sunny-schedule"
                    fill={true}
                    priority={true}
                    sizes="1024px"
                    quality={100}
                    className="object-cover aspect-[0.5389884089] !h-full !w-auto"
                />
                <div className="absolute z-80 top-0 left-0 w-full h-full pt-[0.0273972603%] ">
                    <TimeLine startTime={"2025/05/23 09:00"} endTime={"2025/05/23 17:30"}/>
                </div>
            </div>
        </div>

    );
};

export default Schedule;

