"use client"

import {useData} from "@/hooks/data";
import {useEffect, useRef} from "react";

const LeagueTable = ({i_key, blockName, block}: {
    i_key: string, blockName: string,  block:
        {
            teamId: string
            rank?: number
        }[]

}) => {
    const {getMatchDisplayStr} = useData()

    const teamIds = block.map((team) => team.teamId);

    const teamIdsLengthArray = [-1, ...[...Array(teamIds.length).keys()]]

    const tableRef = useRef<HTMLTableElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    //     tableのサイズ変更を監視
        const resizeObserver = new ResizeObserver(() => {
            if (tableRef.current) {
                const rect = tableRef.current.getBoundingClientRect();
                const width =  rect.width * teamIds.length / (teamIds.length + 1);
                const height = rect.height * teamIds.length / (teamIds.length + 1);
                
                if (lineRef.current) {
                    lineRef.current.style.width = `${Math.pow((Math. pow(width, 2) + Math.pow(height, 2)), 0.5)}px`;
                    lineRef.current.style.rotate = `${Math.atan2(height-1, width) * 180 / Math.PI}deg`;
                }
            }
        });

        if (tableRef.current) {
            resizeObserver.observe(tableRef.current);
        }

        return () => {
            if (tableRef.current) {
                resizeObserver.unobserve(tableRef.current);
            }
        };
        
    }, []);

    
    return (
        <div className={"relative"}>
            <div className={"h-[1px] bg-slate-300 absolute bottom-0 right-0 origin-bottom-right"} ref={lineRef}/>
            <table className={"border-collapse border border-slate-500 w-full h-full"} ref={tableRef}>
                <tbody>
                {
                    teamIdsLengthArray.map((i) => {
                        return (
                            <tr key={"leagueTableTr" + i_key + "-" + i} className={"border border-slate-300"}>
                                {
                                    teamIdsLengthArray.map((j) => {
                                        return (
                                            <td
                                                key={"leagueTableTd" + i_key + "-" + j}
                                                className={`border border-slate-300  h-8 w-16 text-center`}
                                            >
                                                {i === -1 && j === -1 && <p className={"font-bold"}>{blockName}</p>}
                                                {i === -1 && j > -1 && getMatchDisplayStr(block[j]?.teamId)}
                                                {j === -1 && i > -1 && getMatchDisplayStr(block[i]?.teamId)}

                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })

                }
                </tbody>
            </table>
        </div>
    )
}

export default LeagueTable;