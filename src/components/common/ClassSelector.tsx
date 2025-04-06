"use client"
import {Team} from "@prisma/client";
import {useEffect, useState} from "react";

interface ClassSelectorProps {
    callback?: (id: number, name: string) => void
}

const ClassSelector = ({callback}: ClassSelectorProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const [groupedTeams, setGroupedTeams] = useState<Record<string, { id: number, name: string }[]>>()
    const getTeam = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team`
            , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'default'
            }
        )
        const teams = await response.json()
        // nameの最初の1文字目でグルーピング
        const groupedTeams = teams.reduce((acc: Record<string, Team[]>, team: Team) => {
            const firstLetter = team.name.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(team);
            return acc;
        }, {});

        // 要素数が1つのグループはgroupedTeams["他"]にまとめる
        const otherGroups: Team[] = []
        for (const key in groupedTeams) {
            if (groupedTeams[key].length === 1) {
                otherGroups.push(groupedTeams[key][0])
                delete groupedTeams[key]
            }
        }
        if (otherGroups.length > 0) {
            groupedTeams['他'] = otherGroups
        }
        setGroupedTeams(groupedTeams)
    }

    useEffect(() => {
        getTeam()
    }, [])


    return (
        <div
            className={`fixed top-0 left-0 w-fit h-fit px-1 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center ${isVisible ? "visible" : "invisible"}`}>
            {
                groupedTeams ?
                    <table>
                        <tbody>
                        {Object.keys(groupedTeams).map((key) => (
                            <tr key={key} className={"border-y-[1px] border-white"}>
                                <td className="text-center text-2xl font-bold pr-2">{key}</td>
                                {
                                    groupedTeams[key].map((team) => (
                                        <td key={team.id} className="text-center text-lg font-bold">
                                            <button
                                                className={"bg-gray-200 w-18 m-1 hover:bg-gray-300 active:bg-gray-400 text-black px-4 py-2 rounded"}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    if (callback) {
                                                        callback(team.id, team.name)
                                                    }
                                                    setIsVisible(false);
                                                }}
                                            >
                                                {team.name}
                                            </button>
                                        </td>
                                    ))
                                }
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    :
                    <div className="text-center text-2xl font-bold">
                        読み込み中...
                    </div>
            }
        </div>
    );
}
export default ClassSelector;