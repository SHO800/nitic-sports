import MatchesWrapper from "@/components/top/MatchesWrapper";
import Link from "next/link";

export default async function Home() {
    return (

        <div className="min-h-screen">
            <MatchesWrapper title={"WIP"}>
                <p>(実行委員用に公開中)</p>
            </MatchesWrapper>

            <p className="flex justify-center mt-4">
                \ 試合情報の入力はこちら！ /</p>
            <Link href={"/dashboard"} prefetch={true}
                className={"flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"}>
                ダッシュボード
            </Link>
            
            <p className="flex justify-center mt-4">
                \ 次は何の競技だ！ /</p>
            <Link href={"/schedule"} prefetch={true}
                className={"flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"}>
                競技日程表
            </Link>

            <p className="flex justify-center mt-4">
                \ 高専は広いから気をつけろ！ /</p>
            <Link href={"/map"} prefetch={true}
                  className={"flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"}>
                マップ
            </Link>

            <p className="flex justify-center mt-4">
                \ 高専一熱い場所はここだ！！ /</p>
            <Link href={"/infomation"} prefetch={true}
                  className={"flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"}>
                試合情報
            </Link>
        </div>

    );
}
