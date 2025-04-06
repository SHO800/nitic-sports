import ClassSelector from "@/components/common/ClassSelector";
import {useState} from "react";
import {useData} from "@/hooks/data";
import {MatchPlan as MatchPlanSchema} from "@prisma/client";

const MatchPlan = () => {
    const {events, teams, matchPlans, locations, groupedTeams, setMatchPlans} = useData()

    const [isVisibleClassSelector, setIsVisibleClassSelector] = useState(false);
    return (
        <>
            {matchPlans.map((matchPlan) => (
                <div
                    key={matchPlan.id}
                    className='flex items-center justify-between bg-gray-200 p-2 rounded mb-2'
                >
                    <div className='flex items-center'>
                        <p className={`text-black `}>
                            {/*XX月XX日 XX:XX ~ XX:XX*/}
                            {matchPlan.id},
                            {events.find((event) => event.id === matchPlan.eventId)?.name}, {teams.find((team) => team.id === matchPlan.team1Id)?.name} vs {teams.find((team) => team.id === matchPlan.team2Id)?.name}, {new Date(matchPlan.scheduledStartTime).toLocaleString('ja-JP', {
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        })} ~ {new Date(matchPlan.scheduledEndTime).toLocaleString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                            {matchPlan.team1Note} {matchPlan.team2Note},
                            {matchPlan.locationId && locations.find((location) => location.id === matchPlan.locationId)?.name},
                            {matchPlan.matchName},

                        </p>
                    </div>
                    <button
                        onClick={async (e) => {
                            e.preventDefault()
                            const response = await fetch(
                                `${process.env.NEXT_PUBLIC_API_URL}/match-plan/${matchPlan.id}`,
                                {
                                    method: 'DELETE',
                                }
                            )
                            const deleteMatchPlan = await response.json()
                            setMatchPlans(matchPlans.filter((matchPlan) => matchPlan.id !== deleteMatchPlan.id))
                        }}
                        className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'
                    >
                        削除
                    </button>
                </div>
            ))}
            <form
                onSubmit={async (e) => {
                    e.preventDefault()
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/match-plan/-1`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                eventId: Number((document.getElementById('eventId') as HTMLInputElement).value),
                                matchName: (document.getElementById('matchName') as HTMLInputElement).value,
                                team1Id: Number((document.getElementById('team1Id') as HTMLInputElement).value),
                                team2Id: Number((document.getElementById('team2Id') as HTMLInputElement).value),
                                team1Note: (document.getElementById('team1Note') as HTMLInputElement).value,
                                team2Note: (document.getElementById('team2Note') as HTMLInputElement).value,
                                scheduledStartTime: new Date((document.getElementById('scheduledStartTime') as HTMLInputElement).value),
                                scheduledEndTime: new Date((document.getElementById('scheduledEndTime') as HTMLInputElement).value),
                                locationId: Number((document.getElementById('locationId') as HTMLInputElement).value),
                            } as unknown as MatchPlanSchema),
                        }
                    )
                    const newMatchPlan = await response.json()

                    setMatchPlans([...matchPlans, newMatchPlan])
                }}
                className='flex items-center mt-4'
            >

                <div className={"flex flex-col justify-start items-start"}>
                    {/*種目IDの入力内容に対応する種目名を表示*/}
                    <div className={"mr-auto"}>
                        <label className='text-white mr-2'
                               htmlFor="eventId"
                        >種目*</label>
                        <select
                            name="eventId"
                            id="eventId"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            required
                        >
                            {events.map((event) => (
                                <option key={event.id} value={event.id} className={"text-black"}>
                                    {event.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='text-white mr-2'
                               htmlFor="matchName"
                        >試合名</label>
                        <input
                            type='text'
                            name="matchName"
                            id="matchName"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            placeholder='試合名'
                        />
                    </div>
                    <div>
                        <label className='text-white mr-2'
                               htmlFor="team1Id"
                        >チーム1</label>
                        <input
                            type='text'
                            name="team1Id"
                            id="team1Id"
                            className='border border-gray-400 mr-2 rounded text-white w-8 '
                            onFocus={() => {
                                setIsVisibleClassSelector(true)
                            }}

                        />
                        <span id="team1Name" className='text-white mr-2'></span>
                        {/*もしinputがアクティブなら*/}
                        {
                            isVisibleClassSelector && document.activeElement === document.getElementById("team1Id") &&
                            <div className={"fixed top-0 right-0 z-50"}>
                                <div
                                    className={"fixed top-0 left-0 w-screen h-screen bg-black opacity-50 z-40"}
                                    onClick={() => {
                                        setIsVisibleClassSelector(false)
                                    }}
                                />
                                <div className={"fixed top-0 right-0 w-[360] h-fit z-50"}>
                                    <ClassSelector
                                        groupedData={groupedTeams}
                                        callback={(id: number, name: string) => {
                                            console.log(id, name)
                                            const input = document.getElementById('team1Id') as HTMLInputElement;
                                            input.value = id.toString()
                                            const span = document.getElementById('team1Name') as HTMLSpanElement;
                                            span.innerText = name
                                            setIsVisibleClassSelector(false);
                                        }}
                                    />
                                </div>
                            </div>
                        }

                        <label className='text-white mr-2'
                               htmlFor="team1Note"
                        >チーム1メモ</label>
                        <input
                            type='text'
                            name="team1Note"
                            id="team1Note"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            placeholder='チーム1メモ'
                        />
                    </div>
                    <div>
                        <label className='text-white mr-2'
                               htmlFor="team2Id"
                        >チーム2</label>
                        <input
                            type='text'
                            name="team2Id"
                            id="team2Id"
                            className='border border-gray-400 mr-2 rounded text-white w-8'
                            onFocus={() => {
                                setIsVisibleClassSelector(true)
                            }}
                        />
                        <span id="team2Name" className='text-white mr-2'></span>
                        {/*もしinputがアクティブなら*/}
                        {
                            isVisibleClassSelector && document.activeElement === document.getElementById("team2Id") &&
                            <div className={"fixed top-0 right-0 z-50"}>
                                <div
                                    className={"fixed top-0 left-0 w-screen h-screen bg-black opacity-50 z-40"}
                                    onClick={() => {
                                        setIsVisibleClassSelector(false)
                                    }}
                                />
                                <div className={"fixed top-0 right-0 w-[360] h-fit z-50"}>
                                    <ClassSelector
                                        groupedData={groupedTeams}
                                        callback={(id: number, name: string) => {
                                            console.log(id, name)
                                            const input = document.getElementById('team2Id') as HTMLInputElement;
                                            input.value = id.toString()
                                            const span = document.getElementById('team2Name') as HTMLSpanElement;
                                            span.innerText = name
                                            setIsVisibleClassSelector(false);
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        <label className='text-white mr-2'
                               htmlFor="team2Note"
                        >チーム2メモ</label>
                        <input
                            type='text'
                            name="team2Note"
                            id="team2Note"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            placeholder='チーム2メモ'
                        />
                    </div>
                    <div>
                        <label className='text-white mr-2'
                               htmlFor="scheduledStartTime"
                        >開始時間*</label>
                        <input
                            type='datetime-local'
                            name="scheduledStartTime"
                            id="scheduledStartTime"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            placeholder='開始時間'
                            required
                        />
                        <label className='text-white mr-2'
                               htmlFor="scheduledEndTime"
                        >終了時間*</label>
                        <input
                            type='datetime-local'
                            name="scheduledEndTime"
                            id="scheduledEndTime"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            placeholder='終了時間'
                            required
                        />
                    </div>
                    <div>
                        <label className='text-white mr-2'
                               htmlFor="locationId"
                        >場所</label>
                        <input
                            type='text'
                            name="locationId"
                            id="locationId"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            placeholder='場所'
                        />
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
                        `${process.env.NEXT_PUBLIC_API_URL}/match-plan/${(document.getElementById('editEventId') as HTMLInputElement).value}`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: Number((document.getElementById('id') as HTMLInputElement).value),
                                eventId: Number((document.getElementById('eventId') as HTMLInputElement).value),
                                matchName: (document.getElementById('matchName') as HTMLInputElement).value,
                                team1Id: Number((document.getElementById('team1Id') as HTMLInputElement).value),
                                team2Id: Number((document.getElementById('team2Id') as HTMLInputElement).value),
                                team1Note: (document.getElementById('team1Note') as HTMLInputElement).value,
                                team2Note: (document.getElementById('team2Note') as HTMLInputElement).value,
                                scheduledStartTime: new Date((document.getElementById('scheduledStartTime') as HTMLInputElement).value),
                                scheduledEndTime: new Date((document.getElementById('scheduledEndTime') as HTMLInputElement).value),
                                locationId: Number((document.getElementById('locationId') as HTMLInputElement).value),
                            } as unknown as MatchPlanSchema),
                        }
                    )
                    const newMatchPlan = await response.json()

                    setMatchPlans([...matchPlans, newMatchPlan])
                }}
                className='flex items-center mt-4'
            >
                <div className={"flex flex-col justify-start items-start"}>
                    <input
                        type='text'
                        name="editMatchId"
                        id="editMatchId"
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
export default MatchPlan;