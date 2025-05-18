"use client"
import {useState} from "react";
import TeamDataInput from "@/components/dashboard/events/TeamDataInput";
import EventEditForm from "@/components/dashboard/events/EventEditForm";
import {createEvent} from "@/app/actions/data";
import {useDataContext} from "@/contexts/dataContext";

const EventForm = () => {
    const {mutateEvents, matchPlans} = useDataContext()
    const [isTwoStageCompetition, setIsTwoStageCompetition] = useState(false);
    const [isTimeBased, setIsTimeBased] = useState(false);
    const [eventType1, setEventType1] = useState<string | null>("tournament");
    const [eventType2, setEventType2] = useState<string | null>(null);
    const [teamDataJsonDraft, setTeamDataJsonDraft] = useState<TeamData[]>([
        {
            type: "tournament",
            teams: [],
        }
    ]);

    const addTournamentTeamsFromPlans = (teamDataIndex: number) => {
        const eventId = Number((document.getElementById('editEventId') as HTMLInputElement).value);
        if (!eventId) console.error("eventId is required");
        const minPlanId = document.getElementById("minPlanId") as HTMLInputElement;
        if (!minPlanId) console.error("minPlanId is required");
        const plans = matchPlans?.filter((plan) => plan.eventId === eventId && plan.id >= Number(minPlanId.value));
        if (!plans) return;
        const teamIds = plans.map((plan) => plan.teamIds).flat();
        const teams = teamIds.map((teamId) => {
            return {
                teamId: teamId,
                seedCount: 0,
            };
        });
        setTeamDataJsonDraft((prevState) => {
            const newState = [...prevState];
            const teamDataWithIndex = newState[teamDataIndex];
            if (!teamDataWithIndex || teamDataWithIndex.type !== "tournament") return prevState;
            teamDataWithIndex.teams = teams;
            return newState;
        });
    };


    return (
        <>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
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
                                setIsTwoStageCompetition(e.target.checked);
                                setEventType2(e.target.checked ? "tournament" : null);
                                // teamDataJsonDraft[1]を初期値にする
                                if (e.target.checked)
                                    setTeamDataJsonDraft((prevState) => {
                                        const newState = [...prevState];
                                        newState[1] = {
                                            type: "tournament",
                                            teams: []
                                        };
                                        return newState;
                                    });
                            }}
                            checked={isTwoStageCompetition}
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                        />
                        <label
                            htmlFor={"isTwoStageCompetition"}
                            className='text-black mr-2'
                        >予選と本選で形式を区別</label>
                    </div>

                    <div>
                        <input
                            name={"isTimeBased"}
                            id={"isTimeBased"}
                            type="checkbox"
                            onChange={(e) => setIsTimeBased(e.target.checked)}
                            checked={isTimeBased}
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                        />
                        <label
                            htmlFor={"isTimeBased"}
                            className='text-black mr-2'
                        >タイムレース制</label>
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
                                setEventType1(e.target.value);
                                // teamDataJsonDraft[0]を初期値にする
                                if (e.target.value === "tournament")
                                    setTeamDataJsonDraft((prevState) => {
                                        const newState = [...prevState];
                                        newState[0] = {
                                            type: "tournament",
                                            teams: []
                                        };
                                        return newState;
                                    });
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
                                setEventType1(e.target.value);
                                // teamDataJsonDraft[0]を初期値にする
                                if (e.target.value === "league")
                                    setTeamDataJsonDraft((prevState) => {
                                        const newState = [...prevState];
                                        newState[0] = {
                                            type: "league",
                                            blocks: {},
                                        };
                                        return newState;
                                    });
                            }}
                        />
                        <label
                            htmlFor={"eventType1League"}
                            className='text-black mr-2'
                        >リーグ戦</label>
                        <div>
                            <p>チーム入力</p>

                            <TeamDataInput
                                index={0}
                                eventType={eventType1}
                                teamDataJsonDraft={teamDataJsonDraft}
                                setTeamDataJsonDraft={setTeamDataJsonDraft}
                                addTournamentTeamsFromPlans={addTournamentTeamsFromPlans}
                            />
                        </div>
                    </div>
                    {isTwoStageCompetition &&
                        <>
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
                                        setEventType2(e.target.value);
                                        // teamDataJsonDraft[1]を初期値にする
                                        if (e.target.value === "tournament")
                                            setTeamDataJsonDraft((prevState) => {
                                                const newState = [...prevState];
                                                newState[1] = {
                                                    type: "tournament",
                                                    teams: []
                                                };
                                                return newState;
                                            });
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
                                        setEventType2(e.target.value);
                                        // teamDataJsonDraft[1]を初期値にする
                                        if (e.target.value === "league")
                                            setTeamDataJsonDraft((prevState) => {
                                                const newState = [...prevState];
                                                newState[1] = {
                                                    type: "league",
                                                    blocks: {},
                                                };
                                                return newState;
                                            });
                                    }}
                                />
                                <label
                                    htmlFor={"eventType2League"}
                                    className='text-black mr-2'
                                >リーグ戦</label>
                                <div>
                                    <p>チーム入力</p>
                                    <TeamDataInput
                                        index={1}
                                        eventType={eventType2}
                                        teamDataJsonDraft={teamDataJsonDraft}
                                        setTeamDataJsonDraft={setTeamDataJsonDraft}
                                        addTournamentTeamsFromPlans={addTournamentTeamsFromPlans}
                                    />
                                </div>
                            </div>
                        </>
                    }

                    <button
                        type='button'
                        className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                        onClick={async (e) => {
                            e.preventDefault()
                            await createEvent(
                                (document.getElementById('eventName') as HTMLInputElement).value,
                                teamDataJsonDraft,
                                (document.getElementById('eventDescription') as HTMLInputElement).value,
                                isTimeBased,
                            )
                            await mutateEvents();
                        }}
                    >
                        追加
                    </button>
                </div>
            </form>
            <EventEditForm teamDataJsonDraft={teamDataJsonDraft} isTimeBased={isTimeBased}/>
        </>
    );
};

export default EventForm;
