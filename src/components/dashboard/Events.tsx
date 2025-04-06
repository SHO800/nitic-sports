"use client"
import {Event} from "@prisma/client";
import {useData} from "@/hooks/data";
import {useState} from "react";


const Events = () => {
    const {events, setEvents} = useData()
    const [isTwoStageCompetition, setIsTwoStageCompetition] = useState(false)
    const [eventType1, setEventType1] = useState<string | null>("T");
    const [eventType2, setEventType2] = useState<string | null>(null);
    
    const [teamDataJsonDraft, setTeamDataJsonDraft] = useState<object>({})

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
    //     "teams": {
    //       {"teamId": 1 },
    //       {"teamId": 3 },
    //       {"teamId": 2 },
    //   }
    // ]
    // 最終的な順位はこの配列の-1番目のオブジェクトの値を参照すればよい。
    // 予選本選の区別がない場合は1つのオブジェクトを持つ配列を保持する。
    // 例　トーナメントのみ
    // [
    //   {
    //     "type": "tournament",
    //     "teams": {
    //       {"teamId": 1 },
    //       {"teamId": 3 },
    //       {"teamId": 2 },
    //     }
    //   }
    // ]

    // ここにteamIdの他に勝利数等を記録しても良い
    
    return (
        <>
            {events.map((event) => (
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
                                const deleteEvent = await response.json()
                                setEvents(events.filter((event) => event.id !== deleteEvent.id))
                            }}
                            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'
                        >
                            削除
                        </button>
                    </div>
                    <div>

                    </div>
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
                            } as Event),
                        }
                    )
                    const newEvent = await response.json()

                    setEvents([...events, newEvent])
                }}
                className='flex items-center mt-4'
            >
                <div className={"flex flex-col justify-start items-start"}>
                    <div>
                        <input
                            type='text'
                            id='eventName'
                            name='eventName'
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            placeholder='種目名を入力してください'
                        />
                    </div>
                    <div>
                        <input
                            name={"isTwoStageCompetition"}
                            id={"isTwoStageCompetition"}
                            type="checkbox"
                            onChange={(e) => {
                                setIsTwoStageCompetition(e.target.checked)
                                setEventType2(e.target.checked ? "T" : null)
                            }}
                            checked={isTwoStageCompetition}
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                        />
                        <label
                            htmlFor={"isTwoStageCompetition"}
                            className='text-white mr-2'
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
                            value={"T"}
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            defaultChecked
                            onChange={(e) => {
                                setEventType1(e.target.value)
                            }}
                        />
                        <label
                            htmlFor={"eventType1Tournament"}
                            className='text-white mr-2'
                        >トーナメント</label>
                        <input
                            type={"radio"}
                            name={"eventType1"}
                            id={"eventType1League"}
                            value={"R"}
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            onChange={(e) => {
                                setEventType1(e.target.value)
                            }}
                        />
                        <label
                            htmlFor={"eventType1League"}
                            className='text-white mr-2'
                        >リーグ戦</label>
                        
                        
                        <div>
                            <p>チーム入力</p>
                            {
                                eventType1 === "T" ?
                                    <p>トーナメントはチーム数を2の累乗にしてください</p>
                                    :
                                    <p>リーグ戦はチーム数を3以上にしてください</p>
                            }
                            <button
                                type="button"
                                onClick={() => {
                                    const newKey = `team${Object.keys(teamDataJsonDraft).length + 1}`
                                    setTeamDataJsonDraft({
                                        ...teamDataJsonDraft,
                                        [newKey]: "",
                                    })
                                }}
                                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
                            >
                                チーム追加
                            </button>
                            
                            
                        </div>
                    </div>
                    {isTwoStageCompetition && <>
                        <p>本選</p>
                        <div className={"ml-4"}>
                            <input
                                type={"radio"}
                                name={"eventType2"}
                                id={"eventType2Tournament"}
                                value={"T"}
                                className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                                defaultChecked
                                onChange={(e) => {
                                    setEventType2(e.target.value)
                                }}
                            />
                            <label
                                htmlFor={"eventType2Tournament"}
                                className='text-white mr-2'
                            >トーナメント</label>
                            <input
                                type={"radio"}
                                name={"eventType2"}
                                id={"eventType2League"}
                                value={"R"}
                                className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                                onChange={(e) => {
                                    setEventType2(e.target.value)
                                }}
                            />
                            <label
                                htmlFor={"eventType2League"}
                                className='text-white mr-2'
                            >リーグ戦</label>
                        </div>
                    </>
                    }
                    <div>

                    </div>

                    <button
                        type='submit'
                        className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
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
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: Number((document.getElementById('id') as HTMLInputElement).value),
                                name: (document.getElementById('eventName') as HTMLInputElement).value,
                                description: (document.getElementById('eventDescription') as HTMLInputElement).value,
                            } as Event),
                        }
                    )
                    const newEvent = await response.json()

                    setEvents([...events, newEvent])
                }}
                className='flex items-center mt-4'
            >
                <div className={"flex flex-col justify-start items-start"}>
                    <input
                        type='text'
                        name="editEventId"
                        id="editEventId"
                        className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                        placeholder='ID'
                    />
                    <button
                        type='submit'
                        className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
                    >
                        編集
                    </button>
                </div>
            </form>
        </>
    )
}

export default Events;