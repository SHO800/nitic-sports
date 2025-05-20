import Link from "next/link";
import Informations from "@/components/top/Information";
import MatchSearcher from "@/components/top/matchSearcher/MatchSearcher";


export default async function Home() {
    return (
        <div className={"min-h-screen"}>
            <p className={"hidden lg:block text-center"}>本サイトはスマホでの閲覧を推奨しております.</p>
            {/*<MatchesWrapper title={"進行中の試合"}>*/}
            {/* <p>a</p> */}
            {/*<NowHot eventId={"all"} />*/}
            {/*</MatchesWrapper>*/}

            <p className="flex justify-center mt-4">＼ 次は何の競技だ！／</p>
            <Link
                href={"/schedule"}
                className={
                    "flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"
                }
            >
                競技スケジュール
            </Link>

            <p className="flex justify-center mt-4">＼ 高専は広いから気をつけろ！／</p>
            <Link
                href={"/map"}
                className={
                    "flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"
                }
            >
                マップ
            </Link>

            {/*<p className="flex justify-center mt-4">＼ 高専一熱い場所はここだ！！／</p>*/}
            {/*<Link*/}
            {/*    href={"/infomation"}*/}
            {/*    className={*/}
            {/*        "flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"*/}
            {/*    }*/}
            {/*>*/}
            {/*    試合情報*/}
            {/*</Link>*/}

            {/*<p className="flex justify-center mt-4">＼ すべての情報はこちら！／</p>*/}
            {/*<Link*/}
            {/*    href={"/dashboard"}*/}
            {/*    className={*/}
            {/*        "flex justify-center bg-blue-600 hover:bg-blue-500 text-white shadow-md mx-6 mt-0.5 mb-2 py-2 rounded-full"*/}
            {/*    }*/}
            {/*>*/}
            {/*    情報*/}
            {/*</Link>*/}

            <MatchSearcher />
            <Informations/>
        </div>
    );
}
