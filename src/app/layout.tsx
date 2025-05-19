"use cache";
import type {Metadata} from "next";
import {Noto_Sans_JP} from "next/font/google";
import "./globals.css";
import DataPreFetcher from "@/components/common/DataPreFetcher";
import Footer from "@/components/layout/Footer/page";
import Header from "@/components/layout/Header/page";
import {CurrentTimeContextProvider} from "@/contexts/currentTimeContext";
import {DataContextProvider} from "@/contexts/dataContext";
import {Analytics} from "@vercel/analytics/react";
import {SpeedInsights} from "@vercel/speed-insights/next";

const notoSansJp = Noto_Sans_JP({
    subsets: ["latin"],
    weight: ["400", "700"],
    preload: false,
    variable: "--font-noto-sans-jp",
    display: "swap",
    fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "sans-serif"],
});



export const metadata: Metadata = {

    title: "一関 - 体育大会2025",
    description: "一関高専校内体育大会の試合結果をリアルタイムでお届けします！",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" className={"font-noto-sans-jp"}>
        <body
            className={`antialiased text-lg bg-gray-200 `}
        >
        <CurrentTimeContextProvider>
            <Header/>
            <DataPreFetcher>
                <DataContextProvider>{children}</DataContextProvider>
            </DataPreFetcher>
        </CurrentTimeContextProvider>

        <Analytics/>
        <SpeedInsights/>
        <Footer/>
        </body>
        </html>
    );
}
