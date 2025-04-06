import Link from "next/link";

export default async function Home() {
    return (
        <div>
            <Link
                href={"/schedule"}
                className={"absolute top-0 left-0 z-10 p-4 text-white bg-black rounded-full"}
            >
                スケジュール
            </Link>
            <Link
                href={"/dashboard"}
                className={"absolute top-10 left-0 z-10 p-4 text-white bg-black rounded-full"}
            >
                ダッシュボード
            </Link>
            
        </div>
    );
}
