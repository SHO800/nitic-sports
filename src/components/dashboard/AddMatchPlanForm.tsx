import {MatchPlan as MatchPlanSchema} from "@prisma/client"
import ClassSelector from "@/components/common/ClassSelector";
import {useState} from "react";
import {useData} from "@/hooks/data";


const AddMatchPlanForm = () => {

    const [teamCount, setTeamCount] = useState(2);
    const {events, matchPlans, groupedTeams, setMatchPlans, pullMatchPlan} = useData()
    const [isVisibleClassSelector, setIsVisibleClassSelector] = useState(false);
    
    return (
        <>
            <form
                key={"addMatchPlanForm" + teamCount}
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
                                teamIds: (Array.from({length: teamCount}).map((_, index) => {
                                    return (document.getElementById(`team${index + 1}Id`) as HTMLInputElement).value
                                })),
                                teamNotes: (Array.from({length: teamCount}).map((_, index) => {
                                    return (document.getElementById(`team${index + 1}Note`) as HTMLInputElement).value
                                })),
                                scheduledStartTime: new Date((document.getElementById('scheduledStartTime') as HTMLInputElement).value),
                                scheduledEndTime: new Date((document.getElementById('scheduledEndTime') as HTMLInputElement).value),
                                locationId: Number((document.getElementById('locationId') as HTMLInputElement).value),

                            } as unknown as MatchPlanSchema),
                        }
                    )
                    const newMatchPlan = await response.json()
                    console.log("addmatchPlans", newMatchPlan)
                    await pullMatchPlan(newMatchPlan)  
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
                    {/*チーム数は可変*/}
                    <div>
                        <input
                            type="number"
                            id="teamCount"
                            name="teamCount"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                            value={teamCount}
                            onChange={(e) => {
                                setTeamCount(Number(e.target.value))
                            }}
                        />
                        <label className='text-white mr-2'
                               htmlFor="teamCount"
                        >チーム数</label>

                        {
                            [...Array(teamCount)].map((_, index) => (
                                <div key={"matchTeamEditorDiv" + index} className="flex items-center">
                                    <label className='text-white mr-2'
                                           htmlFor={`team${index + 1}Id`}
                                    >チーム{index + 1}</label>
                                    <input
                                        type='text'
                                        name={`team${index + 1}Id`}
                                        id={`team${index + 1}Id`}
                                        className='border border-gray-400 mr-2 rounded text-white w-8'
                                        onFocus={() => {
                                            setIsVisibleClassSelector(true)
                                        }}
                                    />
                                    <span id={`team${index + 1}Name`} className='text-white mr-2'></span>

                                    {/*もしinputがアクティブなら*/}
                                    {
                                        isVisibleClassSelector && document.activeElement === document.getElementById(`team${index + 1}Id`) &&
                                        <div className={"fixed top-0 right-0 z-50"}>
                                            <div
                                                className={"fixed top-0 left-0 w-screen h-screen bg-black opacity-50 z-40"}
                                                onClick={() => {
                                                    setIsVisibleClassSelector(false)
                                                }}
                                            />
                                            <div className={"fixed top-0 right-0 w-[400px] h-[400px] z-50"}>
                                                <ClassSelector
                                                    groupedData={groupedTeams}
                                                    callback={(id: number, name: string) => {
                                                        const input = document.getElementById(`team${index + 1}Id`) as HTMLInputElement;
                                                        input.value = id.toString()
                                                        const span = document.getElementById(`team${index + 1}Name`) as HTMLSpanElement;
                                                        span.innerText = name
                                                        setIsVisibleClassSelector(false);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    }

                                    <input
                                        type='text'
                                        name={`team${index + 1}Note`}
                                        id={`team${index + 1}Note`}
                                        className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                                        placeholder='備考'
                                    />

                                </div>
                            ))
                        }
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
                key={"editMatchPlanForm" + teamCount}
                onSubmit={async (e) => {
                    e.preventDefault()
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/match-plan/${(document.getElementById('editMatchId') as HTMLInputElement).value}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                eventId: Number((document.getElementById('eventId') as HTMLInputElement).value),
                                matchName: (document.getElementById('matchName') as HTMLInputElement).value,
                                teamIds: (Array.from({length: teamCount}).map((_, index) => {
                                    console.log(`team${index + 1}Id`)
                                    return Number((document.getElementById(`team${index + 1}Id`) as HTMLInputElement).value)
                                })),
                                teamNotes: (Array.from({length: teamCount}).map((_, index) => {
                                    return (document.getElementById(`team${index + 1}Note`) as HTMLInputElement).value
                                })),
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
export default AddMatchPlanForm; 