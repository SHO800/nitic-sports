"use client";
import Bracket from "@/components/common/Bracket";
import { useDataContext } from "@/contexts/dataContext";

const EventList = () => {
	const { events, matchPlans } = useDataContext();

	return (
		<>
			{events?.map((event) => (
				<div
					key={event.id}
					className={"flex flex-col w-full justify-start bg-gray-200"}
				>
					<div className="flex items-center justify-between  p-2 rounded mb-2">
						<div className="flex items-center">
							<p className={"text-black "}>
								{event.id} {event.name} {event.description}
							</p>
						</div>
						{/*<button*/}
						{/*    onClick={async (e) => {*/}
						{/*        e.preventDefault()*/}
						{/*        await deleteEvent(event.id);*/}
						{/*        await mutateEvents()*/}
						{/*    }}*/}
						{/*    className='bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded'*/}
						{/*>*/}
						{/*    削除*/}
						{/*</button>*/}
					</div>
					{event.description && (
						<div className="flex items-center">
							<p className={"text-black "}>{event.description}</p>
						</div>
					)}
					<div className={"ml-2 bg-white rounded-xl"}>
						{matchPlans && matchPlans.length > 0 && (
							<Bracket eventId={event.id} matchPlans={matchPlans} />
						)}
					</div>
				</div>
			))}
		</>
	);
};

export default EventList;
