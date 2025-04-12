import {MatchPlan as MatchPlanSchema} from "@prisma/client"
import ClassSelector from "@/components/common/ClassSelector";
import {useState} from "react";
import {useData} from "@/hooks/data";


const AddMatchPlanForm = () => {

    const [teamCount, setTeamCount] = useState(2);
    const {events, groupedTeams, mutateMatchPlans} = useData()
    const [isVisibleClassSelector, setIsVisibleClassSelector] = useState(false);

    // 試合名の頭文字を自動でインクリメントするか
    const [isIncrementMatchNameCapital, setIsIncrementMatchNameCapital] = useState(false)
    // 試合名の文字を自動インクリメントするか
    const [isIncrementMatchNameNumber, setIsIncrementMatchNameNumber] = useState(false)
    // 会場を自動インクリメントするか
    const [isIncrementLocation, setIsIncrementLocation] = useState(false)
    // 会場をどこからインクリメントするか
    const [incrementLocationRange, setIncrementLocationRange] = useState(0)
    // 会場をどこまでインクリメントするか
    const [incrementLocationRangeEnd, setIncrementLocationRangeEnd] = useState(0)


    const increment = () => {
        if (isIncrementMatchNameCapital || isIncrementMatchNameNumber) {

            // 名前インプットフィールド取得
            const matchNameInput = document.getElementById('matchName') as HTMLInputElement;
            
            // 入力内容取得
            const matchName = matchNameInput.value;
            // インクリメントするか
            if (isIncrementMatchNameCapital) {
                // 先頭の文字をインクリメント
                const firstChar = matchName.charAt(0);
                const incrementedChar = String.fromCharCode(firstChar.charCodeAt(0) + 1);
                matchNameInput.value = incrementedChar + matchName.slice(1);
            }
            if (isIncrementMatchNameNumber) {
                // 扱うのは①等の丸数字
                // 先頭の文字をインクリメント
                const firstChar = matchName.charAt(0);
                const incrementedChar = String.fromCharCode(firstChar.charCodeAt(0) + 1);
                matchNameInput.value = incrementedChar + matchName.slice(1);
            }
        }
        if (isIncrementLocation) {
            // 会場インプットフィールド取得
            const locationInput = document.getElementById('locationId') as HTMLInputElement;
            // 入力内容取得
            const location = locationInput.value;
            // 範囲取得
            const incrementLocationRange = Number((document.getElementById('incrementLocationRange') as HTMLInputElement).value);
            const incrementLocationRangeEnd = Number((document.getElementById('incrementLocationRangeEnd') as HTMLInputElement).value);
            
            // インクリメント
            const incrementedLocation = Number(location) + incrementLocationRange;
            // インクリメント範囲を超えたらリセット
            if (incrementedLocation > incrementLocationRangeEnd) {
                locationInput.value = incrementLocationRange.toString();
            } else {
                locationInput.value = incrementedLocation.toString();
            }
            
        }
    }


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
                                matchNote: (document.getElementById('teamNote') as HTMLInputElement).value,
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
                    console.log(response)
                    await mutateMatchPlans();
                    // インクリメントする場合はインクリメント
                    if (isIncrementMatchNameCapital || isIncrementMatchNameNumber) {
                        increment()
                    }
                }}
                className='flex items-center mt-4'
            >

                <div className={"flex flex-col justify-start items-start"}>
                    {/*種目IDの入力内容に対応する種目名を表示*/}
                    <div className={"mr-auto"}>
                        <label className='text-black mr-2'
                               htmlFor="eventId"
                        >種目*</label>
                        <select
                            name="eventId"
                            id="eventId"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            required
                        >
                            {events?.map((event) => (
                                <option key={event.id} value={event.id} className={"text-black"}>
                                    {event.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='text-black mr-2'
                               htmlFor="matchName"
                        >試合名</label>
                        <input
                            type='text'
                            name="matchName"
                            id="matchName"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            placeholder='試合名'
                        />
                        <input
                            type='checkbox'
                            name="isIncrementMatchNameCapital"
                            id="isIncrementMatchNameCapital"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            checked={isIncrementMatchNameCapital}
                            onChange={(e) => {
                                setIsIncrementMatchNameCapital(e.target.checked)
                            }}
                        />
                        <label className='text-black mr-2'
                               htmlFor="isIncrementMatchNameCapital"
                        >頭文字++</label>
                        <input
                            type='checkbox'
                            name="isIncrementMatchNameNumber"
                            id="isIncrementMatchNameNumber"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            checked={isIncrementMatchNameNumber}
                            onChange={(e) => {
                                setIsIncrementMatchNameNumber(e.target.checked)
                            }}
                        />
                        <label className='text-black mr-2'
                               htmlFor="isIncrementMatchNameNumber"
                        >数字++</label>
                        <input
                            type='text'
                            name="teamNote"
                            id="teamNote"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            placeholder='備考'
                        />
                    </div>
                    {/*チーム数は可変*/}
                    <div>
                        <input
                            type="number"
                            id="teamCount"
                            name="teamCount"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            value={teamCount}
                            onChange={(e) => {
                                setTeamCount(Number(e.target.value))
                            }}
                        />
                        <label className='text-black mr-2'
                               htmlFor="teamCount"
                        >チーム数</label>

                        {
                            [...Array(teamCount)].map((_, index) => (
                                <div key={"matchTeamEditorDiv" + index} className="flex items-center">
                                    <label className='text-black mr-2'
                                           htmlFor={`team${index + 1}Id`}
                                    >チーム{index + 1}</label>
                                    <input
                                        type='text'
                                        name={`team${index + 1}Id`}
                                        id={`team${index + 1}Id`}
                                        className='border border-gray-400 mr-2 rounded text-black w-8'
                                        onFocus={() => {
                                            setIsVisibleClassSelector(true)
                                        }}
                                    />
                                    <span id={`team${index + 1}Name`} className='text-black mr-2'></span>

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
                                                    callback={(id: string, name: string) => {
                                                        const input = document.getElementById(`team${index + 1}Id`) as HTMLInputElement;
                                                        input.value = id;
                                                        const span = document.getElementById(`team${index + 1}Name`) as HTMLSpanElement;
                                                        span.innerText = name;
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
                                        className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                                        placeholder='備考'
                                    />

                                </div>
                            ))
                        }
                    </div>
                    <div>
                        <label className='text-black mr-2'
                               htmlFor="locationId"
                        >場所</label>
                        <input
                            type='text'
                            name="locationId"
                            id="locationId"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            placeholder='場所'
                        />
                        <input
                            type='checkbox'
                            name="isIncrementLocation"
                            id="isIncrementLocation"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            checked={isIncrementLocation}
                            onChange={(e) => {
                                setIsIncrementLocation(e.target.checked)
                            }}
                        />
                        <label className='text-black mr-2'
                               htmlFor="isIncrementLocation"
                        >場所++</label>
                        {isIncrementLocation &&
                            <div>
                                <p className='text-black mr-2'
                                >範囲</p>
                                <input
                                    type='number'
                                    name="incrementLocationRange"
                                    id="incrementLocationRange"
                                    className='border border-gray-400 px-2 py-2 mr-2 rounded text-black w-16'
                                    placeholder='場所のインクリメント範囲'
                                    value={incrementLocationRange}
                                    onChange={(e) => {
                                        setIncrementLocationRange(Number(e.target.value))
                                    }}
                                />
                                ~
                                <input
                                    type='number'
                                    name="incrementLocationRangeEnd"
                                    id="incrementLocationRangeEnd"
                                    className='border border-gray-400 px-2 py-2 mr-2 rounded text-black w-16'
                                    placeholder='場所のインクリメント範囲'
                                    value={incrementLocationRangeEnd}
                                    onChange={(e) => {
                                        setIncrementLocationRangeEnd(Number(e.target.value))
                                    }}
                                />
                            </div>
                        }
                    </div>
                    <div>
                        <label className='text-black mr-2'
                               htmlFor="scheduledStartTime"
                        >開始時間*</label>
                        <input
                            type='datetime-local'
                            name="scheduledStartTime"
                            id="scheduledStartTime"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            placeholder='開始時間'
                            required
                        />
                        <label className='text-black mr-2'
                               htmlFor="scheduledEndTime"
                        >終了時間*</label>
                        <input
                            type='datetime-local'
                            name="scheduledEndTime"
                            id="scheduledEndTime"
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            placeholder='終了時間'
                            required
                        />
                    </div>
                    <button
                        type='submit'
                        className='bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded'
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
                                teamNote: (document.getElementById('teamNote') as HTMLInputElement).value,
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
                    console.log(response)
                    await mutateMatchPlans();
                }}
                className='flex items-center mt-4'
            >
                <div className={"flex flex-col justify-start items-start"}>
                    <input
                        type='text'
                        name="editMatchId"
                        id="editMatchId"
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
        </>
    )
}
export default AddMatchPlanForm; 