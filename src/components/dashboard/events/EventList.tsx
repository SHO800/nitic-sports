"use client"
import {useData} from "@/hooks/data";
import LeagueTable from "@/components/common/LeagueTable";
import TournamentTable from "@/components/common/TournamentTable";

const EventList = () => {
    const {events, mutateEvents, matchPlans} = useData();

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
                        if (!teamData || teamData === "") return null;
                        const teamDataWithType = teamData as unknown as TeamData;
                        
                        return (
                            <div
                                key={"eventListDetails" + event.id + "-" + index}
                                className='flex items-center justify-between bg-gray-200 p-2 rounded mb-2'
                            >
                                <div className='flex items-center'>
                                    <div className={`text-black w-full`}>

                                        {teamDataWithType && teamDataWithType.type === "tournament" ?
                                            matchPlans && teamDataWithType.matchPlanIdRange &&
                                            <TournamentTable teams={teamDataWithType.teams}
                                                             matchPlans={matchPlans.filter(plan => teamDataWithType.matchPlanIdRange!.start <= plan.id && plan.id <= teamDataWithType.matchPlanIdRange!.end || (teamDataWithType.matchPlanIdRange!.additional && teamDataWithType.matchPlanIdRange!.additional?.includes(plan.id)))}/>
                                            :
                                            <>
                                                <p>(行-列)の順</p>
                                                {
                                                    Object.keys(teamDataWithType.blocks).map((block, index) => (
                                                        <LeagueTable key={event.id.toString() + block + index}
                                                                     i_key={"i_" + event.id.toString() + block + index}
                                                                     eventId={event.id} blockName={block}
                                                                     block={teamDataWithType.blocks![block]}/>
                                                    ))
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ))}
        </>
    );
};

export default EventList;
