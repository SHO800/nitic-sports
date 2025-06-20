"use client";

import {Transition} from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import {useState} from "react";
import Clock from "@/components/common/Clock";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="fixed z-100 w-full bg-blue-900 text-white p-4 rounded-b-xl">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-lg font-bold grow block w-full">
                        2025年度体育大会
                    </Link>

                    <div className={"scale-50 lg:fixed lg:top-1 lg:left-1/2 lg:-translate-x-1/2 shrink w-fit"}>
                        <Clock/>
                    </div>


                    {/* ハンバーガーアイコン */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden relative flex w-10 h-10 justify-center items-center"
                        aria-label="Toggle menu"
                    >
						<span
                            className={clsx(
                                "absolute w-6 h-0.5 bg-white transition-transform duration-300",
                                isOpen ? "rotate-45" : "top-2.5",
                            )}
                        />
                        <span
                            className={clsx(
                                "absolute w-6 h-0.5 bg-white transition-all duration-300",
                                isOpen ? "opacity-0" : "",
                            )}
                        />
                        <span
                            className={clsx(
                                "absolute w-6 h-0.5 bg-white transition-transform duration-300",
                                isOpen ? "-rotate-45" : "bottom-2.5",
                            )}
                        />
                    </button>

                    {/* メニュー（PC用） */}
                    <div className="hidden md:flex gap-4">
                        <Link href="/">Home</Link>
                        <Link href="/schedule">Schedule</Link>
                        <Link href="/map">Map</Link>
                    </div>
                </div>

                {/* メニュー（モバイル用） */}
                <Transition
                    show={isOpen}
                    enter="transition-transform duration-300"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition-transform duration-300"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <div
                        className="md:hidden relative z-50 bg-gray-200 text-black mt-2 p-4 flex flex-col gap-4 transform rounded">
                        <Link href="/" onClick={() => setIsOpen(!isOpen)} className="pl-2">
                            Home
                        </Link>
                        <div className="h-0.5 bg-gray-400"/>
                        {/*<Link*/}
                        {/*    href="/dashboard"*/}
                        {/*    onClick={() => setIsOpen(!isOpen)}*/}
                        {/*    className="pl-2"*/}
                        {/*>*/}
                        {/*    Dashboard*/}
                        {/*</Link>*/}
                        <Link
                            href="/schedule"
                            onClick={() => setIsOpen(!isOpen)}
                            className="pl-2"
                        >
                            Schedule
                        </Link>
                        <div className="h-0.5 bg-gray-400"/>
                        {/*<Link*/}
                        {/*    href="/infomation"*/}
                        {/*    onClick={() => setIsOpen(!isOpen)}*/}
                        {/*    className="pl-2"*/}
                        {/*>*/}
                        {/*    Infomation*/}
                        {/*</Link>*/}
                        <Link
                            href="/map"
                            onClick={() => setIsOpen(!isOpen)}
                            className="pl-2"
                        >
                            Map
                        </Link>
                    </div>
                </Transition>
            </nav>
            <div className="w-full p-6 rounded">blank</div>
        </>
    );
}
