import MatchesWrapper from "@/components/top/MatchesWrapper";
import Link from "next/link";
import DataPreFetcher from "@/components/common/DataPreFetcher";

export default async function Home() {
    return (
        <DataPreFetcher>
            <div className="min-h-screen">
                <MatchesWrapper title={"進行中の試合"}>
                    <p>a</p>
                </MatchesWrapper>
                
                <p className="flex justify-center mt-4">
                    \ 試合情報の入力はこちら！ /</p>
                <Link href={"/dashboard"} className={"flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"}>
                ダッシュボード
                </Link>

                <p className="flex justify-center mt-4">
                    \ 次は何の競技だ！ /</p>
                <Link href={"/schedule"} className={"flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"}>
                競技日程表
                </Link>

                <p className="flex justify-center mt-4">
                    \ 高専は広いから気をつけろ！ /</p>
                <Link href={"/map"} className={"flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"}>
                競技マップ
                </Link>
            </div>
        </DataPreFetcher>
    );
}
