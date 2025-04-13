"use client"
import {useData} from "@/hooks/data";
import {useCallback, useState} from "react";
import LeagueTable from "@/components/common/LeagueTable";
import TournamentTable from "@/components/common/TournamentTable";


const Events = () => {
    const {events, mutateEvents, matchPlans, getMatchDisplayStr} = useData()
    const [isTwoStageCompetition, setIsTwoStageCompetition] = useState(false)
    const [eventType1, setEventType1] = useState<string | null>("tournament");
    const [eventType2, setEventType2] = useState<string | null>(null);

    const [teamDataJsonDraft, setTeamDataJsonDraft] = useState<TeamData[]>([{
        type: "tournament",
        teams: [],
    }]) // 初期値


    const addTournamentTeamsFromPlans = useCallback((teamDataIndex: number) => {
        const eventId = Number((document.getElementById('editEventId') as HTMLInputElement).value)
        if (!eventId) console.error("eventId is required")
        const minPlanId = document.getElementById("minPlanId") as HTMLInputElement
        if (!minPlanId) console.error("minPlanId is required")
        const plans = matchPlans?.filter((plan) => plan.eventId === eventId && plan.id >= Number(minPlanId.value))
        if (!plans) return
        const teamIds = plans.map((plan) => plan.teamIds).flat()
        const teams = teamIds.map((teamId) => {
            return {
                teamId: teamId,
            }
        })
        setTeamDataJsonDraft((prevState) => {
            const newState = [...prevState]
            newState[teamDataIndex].teams = teams
            return newState
        })
    }, [matchPlans])


    // 例 予選はリーグ, 本選はトーナメントの場合
    // [
    //   {
    //     "type": "league",
    //     "blocks": {
    //       "A": [
    //         { "teamId": 1 },
    //         { "teamId": 2 }
    //        ],
    //       "B": [
    //         { "teamId": 3 },
    //         { "teamId": 4 }
    //        ]
    //     }
    //   },
    //  {
    //     "type": "tournament",
    //     "teams": [
    //       {"teamId": 1 },
    //       {"teamId": 3 },
    //       {"teamId": 2 },
    //   ]
    // ]
    // 最終的な順位はこの配列の-1番目のオブジェクトの値を参照すればよい。
    // 予選本選の区別がない場合は1つのオブジェクトを持つ配列を保持する。
    // 例　トーナメントのみ
    // [
    //   {
    //     "type": "tournament",
    //     "teams": [
    //       {"teamId": 1 },
    //       {"teamId": 3 },
    //       {"teamId": 2 },
    //     ]
    //   }
    // ]


    return (
        <>
            {events?.map((event) => (
                <div
                    key={event.id}
                    className={"flex flex-col w-full justify-start "}
                >
                    <div
                        className='flex items-center justify-between bg-gray-200 p-2 rounded mb-2'
                    >
                        <div className='flex items-center'>
                            <p className={`text-black `}>
                                {event.id} {event.name} {event.description}
                            </p>
                        </div>
                        <button
                            onClick={async (e) => {
                                e.preventDefault()
                                const response = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_URL}/event/${event.id}`,
                                    {
                                        method: 'DELETE',
                                    }
                                )
                                console.log(response)
                                await mutateEvents()
                            }}
                            className='bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded'
                        >
                            削除
                        </button>
                    </div>
                    {event.teamData.length > 0 && event.teamData.map((teamData, index) => {
                        return (
                            <div
                                key={"eventListDetails" + event.id + "-" + index}
                                className='flex items-center justify-between bg-gray-200 p-2 rounded mb-2'
                            >
                                <div className='flex items-center'>
                                    <div className={`text-black w-full`}>
                                        {(teamData as unknown as TeamData).type === "tournament" ?
                                            matchPlans && teamData && (teamData as unknown as TeamData).matchPlanIdRange && 
                                            <TournamentTable teams={(teamData as unknown as TeamData).teams!}
                                                             matchPlans={matchPlans.filter(plan => (teamData as unknown as TeamData).matchPlanIdRange!.start <= plan.id && plan.id <= (teamData as unknown as TeamData).matchPlanIdRange!.end ||  ((teamData as unknown as TeamData).matchPlanIdRange!.additional && (teamData as unknown as TeamData).matchPlanIdRange!.additional?.includes(plan.id) ))} />
                                            :
                                            Object.keys((teamData as unknown as TeamData).blocks!).map((block, index) => (
                                            <LeagueTable key={event.id.toString()+block+index} i_key={"i_"+event.id.toString()+block+index} blockName={block} block={(teamData as unknown as TeamData).blocks![block]}/>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            ))}

            <form
                onSubmit={async (e) => {
                    e.preventDefault()
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/event/-1`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: (document.getElementById('eventName') as HTMLInputElement).value,
                                description: (document.getElementById('eventDescription') as HTMLInputElement).value,
                                teamData: JSON.stringify(teamDataJsonDraft),
                            }),
                        }
                    )
                    console.log(response)
                    await mutateEvents();
                }}
                className='flex items-center mt-4'
            >
                <div className={"flex flex-col justify-start items-start"}>
                    <div>
                        <input
                            type='text'
                            id='eventName'
                            name='eventName'
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            placeholder='種目名を入力してください'
                        />
                    </div>
                    <div>
                        <input
                            type='text'
                            id='eventDescription'
                            name='eventDescription'
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            placeholder='種目の説明を入力してください'
                        />
                    </div>

                    <div>
                        <input
                            name={"isTwoStageCompetition"}
                            id={"isTwoStageCompetition"}
                            type="checkbox"
                            onChange={(e) => {
                                setIsTwoStageCompetition(e.target.checked)
                                setEventType2(e.target.checked ? "tournament" : null)
                                // teamDataJsonDraft[1]を初期値にする
                                if (e.target.checked)
                                    setTeamDataJsonDraft((prevState) => {
                                        const newState = [...prevState]
                                        newState[1] = {
                                            type: "tournament",
                                            teams: []
                                        }
                                        return newState
                                    })
                            }}
                            checked={isTwoStageCompetition}
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                        />
                        <label
                            htmlFor={"isTwoStageCompetition"}
                            className='text-black mr-2'
                        >予選と本選で形式を区別</label>
                    </div>
                    {isTwoStageCompetition &&
                        <p>予選</p>
                    }
                    <div className={"ml-4"}>
                        <input
                            type={"radio"}
                            name={"eventType1"}
                            id={"eventType1Tournament"}
                            value={"tournament"}
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            defaultChecked
                            onChange={(e) => {
                                setEventType1(e.target.value)
                                // teamDataJsonDraft[0]を初期値にする
                                setTeamDataJsonDraft((prevState) => {
                                    const newState = {...prevState}
                                    newState[0] = {
                                        type: e.target.value,
                                        teams: []
                                    }
                                    return newState
                                })
                            }}
                        />
                        <label
                            htmlFor={"eventType1Tournament"}
                            className='text-black mr-2'
                        >トーナメント</label>
                        <input
                            type={"radio"}
                            name={"eventType1"}
                            id={"eventType1League"}
                            value={"league"}
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            onChange={(e) => {
                                setEventType1(e.target.value)
                                // teamDataJsonDraft[0]を初期値にする
                                setTeamDataJsonDraft((prevState) => {
                                    const newState = {...prevState}
                                    newState[0] = {
                                        type: e.target.value,
                                        blocks: {},
                                    }
                                    return newState
                                })
                            }}
                        />
                        <label
                            htmlFor={"eventType1League"}
                            className='text-black mr-2'
                        >リーグ戦</label>
                        <div>
                            <p>チーム入力</p>
                            {
                                eventType1 === "tournament" ?
                                    <>
                                        {teamDataJsonDraft[0].teams!.map((key, index) => (
                                            <div key={"teamDataJsonDraft[0]TournamentDiv" + index}
                                                 className={""}>
                                                <input
                                                    type="text"
                                                    name={`team${index}`}
                                                    id={`team${index}`}
                                                    className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                                                    placeholder='チーム名を入力してください'
                                                    value={key.teamId}
                                                    onChange={(e) => {
                                                        const newTeamData = {...teamDataJsonDraft}
                                                        newTeamData[0].teams![index] = { // トグル切替時にteamsの存在を保証
                                                            teamId: e.target.value,
                                                        }
                                                        setTeamDataJsonDraft(newTeamData)
                                                    }}
                                                />
                                                <span
                                                    className={`text-black `}>
                                                    {getMatchDisplayStr(key.teamId)}
                                                </span>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newTeamData = {...teamDataJsonDraft}
                                                newTeamData[0].teams!.push({
                                                    teamId: "0",
                                                })
                                                setTeamDataJsonDraft(newTeamData)
                                            }}
                                            className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                                        >
                                            チーム追加
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => addTournamentTeamsFromPlans(0)}
                                            className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                                        >
                                            試合プランからチームを追加
                                        </button>

                                    </>
                                    :
                                    <>
                                        {
                                            Object.keys(teamDataJsonDraft[0].blocks!).map((key, index) => (
                                                <div key={"teamDataJsonDraft[0]LeagueDiv" + index}
                                                     className={"flex flex-col"}>
                                                    <p>{key}</p>
                                                    {teamDataJsonDraft[0].blocks![key].map((team, teamIndex) => (
                                                        <input
                                                            key={"teamDataJsonDraft[0]LeagueInput" + index + teamIndex}
                                                            type="text"
                                                            name={`team${index}-${teamIndex}`}
                                                            id={`team${index}-${teamIndex}`}
                                                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                                                            placeholder='IDを入力してください'

                                                            onChange={(e) => {
                                                                const newTeamData = {...teamDataJsonDraft}
                                                                newTeamData[0].blocks![key][teamIndex] = {
                                                                    teamId: e.target.value,
                                                                }
                                                                setTeamDataJsonDraft(newTeamData)
                                                            }}
                                                        />
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newTeamData = {...teamDataJsonDraft}
                                                            newTeamData[0].blocks![key].push({
                                                                teamId: "0",
                                                            })
                                                            setTeamDataJsonDraft(newTeamData)
                                                        }}
                                                        className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                                                    >
                                                        チーム追加
                                                    </button>

                                                </div>
                                            ))
                                        }
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newTeamData = {...teamDataJsonDraft}
                                                const blockName = String.fromCharCode(65 + Object.keys(newTeamData[0].blocks!).length)
                                                newTeamData[0].blocks![blockName] = []
                                                setTeamDataJsonDraft(newTeamData)
                                            }}
                                            className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                                        >
                                            ブロック追加
                                        </button>
                                    </>
                            }
                        </div>
                    </div>
                    {isTwoStageCompetition && <>
                        <p>本選</p>
                        <div className={"ml-4"}>
                            <input
                                type={"radio"}
                                name={"eventType2"}
                                id={"eventType2Tournament"}
                                value={"tournament"}
                                className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                                defaultChecked
                                onChange={(e) => {
                                    setEventType2(e.target.value)
                                    // teamDataJsonDraft[1]を初期値にする
                                    setTeamDataJsonDraft((prevState) => {
                                        const newState = {...prevState}
                                        newState[1] = {
                                            type: e.target.value,
                                            teams: []
                                        }
                                        return newState
                                    })
                                }}
                            />
                            <label
                                htmlFor={"eventType2Tournament"}
                                className='text-black mr-2'
                            >トーナメント</label>
                            <input
                                type={"radio"}
                                name={"eventType2"}
                                id={"eventType2League"}
                                value={"league"}
                                className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                                onChange={(e) => {
                                    setEventType2(e.target.value)
                                    // teamDataJsonDraft[1]を初期値にする
                                    setTeamDataJsonDraft((prevState) => {
                                        const newState = {...prevState}
                                        newState[1] = {
                                            type: e.target.value,
                                            blocks: {},
                                        }
                                        return newState
                                    })
                                }}
                            />
                            <label
                                htmlFor={"eventType2League"}
                                className='text-black mr-2'
                            >リーグ戦</label>
                            <div>
                                <p>チーム入力</p>
                                {
                                    eventType2 === "tournament" ?
                                        <>
                                            {teamDataJsonDraft[1].teams!.map((key, index) => (
                                                <div key={"teamDataJsonDraft[1]TournamentDiv" + index}
                                                     className={""}>
                                                    <input
                                                        type="text"
                                                        name={`team${index}`}
                                                        id={`team${index}`}
                                                        className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                                                        value={key.teamId}
                                                        placeholder='チーム名を入力してください'
                                                        onChange={(e) => {
                                                            const newTeamData = {...teamDataJsonDraft}
                                                            newTeamData[1].teams![index] = { // トグル切替時にteamsの存在を保証
                                                                teamId: e.target.value,
                                                            }
                                                            setTeamDataJsonDraft(newTeamData)
                                                        }
                                                        }
                                                    />
                                                    <span
                                                        className={`text-black `}>
                                                        {getMatchDisplayStr(key.teamId)}
                                                    </span>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newTeamData = {...teamDataJsonDraft}
                                                    newTeamData[1].teams!.push({
                                                        teamId: "0",
                                                    })
                                                    setTeamDataJsonDraft(newTeamData)
                                                }}
                                                className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                                            >
                                                チーム追加
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => addTournamentTeamsFromPlans(1)}
                                                className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                                            >
                                                試合プランからチームを追加
                                            </button>
                                        </>
                                        :
                                        <>
                                            {
                                                Object.keys(teamDataJsonDraft[1].blocks!).map((key, index) => (
                                                    <div key={"teamDataJsonDraft[1]LeagueDiv" + index}
                                                         className={"flex flex-col"}>
                                                        <p>{key}</p>
                                                        {teamDataJsonDraft[1].blocks![key].map((team, teamIndex) => (
                                                            <input
                                                                key={"teamDataJsonDraft[1]LeagueInput" + index + teamIndex}
                                                                type="text"
                                                                name={`team${index}-${teamIndex}`}
                                                                id={`team${index}-${teamIndex}`}
                                                                className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                                                                placeholder='IDを入力してください'

                                                                onChange={(e) => {
                                                                    const newTeamData = {...teamDataJsonDraft}
                                                                    newTeamData[1].blocks![key][teamIndex] = {
                                                                        teamId: e.target.value,
                                                                    }
                                                                    setTeamDataJsonDraft(newTeamData)
                                                                }}
                                                            />
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newTeamData = {...teamDataJsonDraft}
                                                                newTeamData[1].blocks![key].push({
                                                                    teamId: "0",
                                                                })
                                                                setTeamDataJsonDraft(newTeamData)
                                                            }}
                                                            className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                                                        >
                                                            チーム追加
                                                        </button>

                                                    </div>
                                                ))
                                            }
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newTeamData = {...teamDataJsonDraft}
                                                    const blockName = String.fromCharCode(65 + Object.keys(newTeamData[1].blocks!).length)
                                                    newTeamData[1].blocks![blockName] = []
                                                    setTeamDataJsonDraft(newTeamData)
                                                }}
                                                className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                                            >
                                                ブロック追加
                                            </button>
                                        </>
                                }
                            </div>

                        </div>
                    </>
                    }


                    <button
                        type='submit'
                        className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                    >
                        追加
                    </button>
                </div>
            </form>
            {/*    編集用*/}
            <form
                onSubmit={async (e) => {
                    e.preventDefault()
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/event/${(document.getElementById('editEventId') as HTMLInputElement).value}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: (document.getElementById('eventName') as HTMLInputElement).value,
                                description: (document.getElementById('eventDescription') as HTMLInputElement).value,
                                teamData: JSON.stringify(teamDataJsonDraft),
                            }),

                        }
                    )
                    console.log(response)
                }}
                className='flex items-center mt-4'
            >
                <div className={"flex flex-col justify-start items-start"}>
                    <input
                        type='text'
                        name="editEventId"
                        id="editEventId"
                        className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                        placeholder='ID'
                    />
                    <button
                        type='submit'
                        className='bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded'
                    >
                        編集
                    </button>
                </div>
            </form>
            <div>
                <input
                    type='text'
                    id='minPlanId'
                    name='minPlanId'
                    className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                    placeholder='最小試合プランIDを入力してください'
                />

            </div>
        </>
    )
}

export default Events;