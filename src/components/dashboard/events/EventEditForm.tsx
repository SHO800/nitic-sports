"use client"
import {useData} from "@/hooks/data";

const EventEditForm = ({teamDataJsonDraft}: {teamDataJsonDraft: TeamData[]}) => {
    const {mutateEvents} = useData();

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
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
                );
                console.log(response);
                await mutateEvents();
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
    );
};

export default EventEditForm;
