import Image from "next/image";
import {Noto_Sans_JP} from "next/font/google";

// notosansフォント
const notoSansJPFont = Noto_Sans_JP({
    weight: "400",
    subsets: ["latin"]
})
const Footer = () => {


    return <footer
        className={"bg-blue-900 text-white text-center py-4 w-full rounded-t flex flex-col items-center text-[.8em]  "}>
        <p className={"text-lg"}>一関高専 - 体育大会</p>
        <p className={"mt-1 text-sm"}>2025.05.22 & 05.23</p>

        <div className={"flex flex-row justify-center space-x-2 mt-2"}>
            <a className={"underline underline-offset-1"} href={"https://www.ichinoseki.ac.jp"}>一関高専HP</a>
            <a className={"underline underline-offset-1"} href={"https://x.com/ichinoseki_nct/"}>一関高専X</a>
            <a className={"underline underline-offset-1"} href={"https://mobile.x.com/gakusei_kosen/"}>学生会X</a>
            <a className={"underline underline-offset-1"}
               href={"https://www.instagram.com/nitic_gakuseikai/"}>学生会インスタ</a>
        </div>

        <p className={"mt-4 text-xs"}>制作</p>
        <p className={"mt-2 text-sm"}>R7年度4J有志2名</p>
        <p className={"mt-3 text-xs"}>協力</p>
        <p className={"mt-2 text-sm"}>R7体育大会実行委員会</p>
        <div className={"relative mt-3 " + notoSansJPFont.className}>
            <div className={"flex flex-row space-x-36 w-full justify-center "}>
                <div className={"flex flex-row justify-start w-[40px] py-1 relative"}>
                    <Image src={"/footer/densan.webp"}
                           alt={"一関高専電算部"}
                           width={40}
                           height={40}
                    />
                    <p className={"absolute w-[10em] text-center mx-3 left-2 top-0"}>電子計算機部</p>
                </div>
                <div className={"flex flex-row justify-end w-[40px] py-1 relative"}>
                    <p className={"absolute w-[10em] text-center mx-3 right-4 bottom-0"}>システム研究部</p>
                    <Image src={"/footer/its.webp"}
                           alt={"システム研究部"}
                           width={40}
                           height={40}
                    />
                </div>

            </div>
            <div className={"absolute bg-white w-[90px] h-[1px] top-[24px] left-[70px]"}/>
            <div className={"absolute bg-white w-5 h-[1px] top-[31px] left-[53px] -rotate-45"}/>
            <div className={"absolute bg-white w-5 h-[1px] top-[17px] left-[157px] -rotate-45"}/>
        </div>

    </footer>
}

export default Footer;