"use client";
import { updateEvent } from "@/app/actions/data";
import { useDataContext } from "@/contexts/dataContext";
import LoadingButton from "@/components/common/LoadingButton";
import {useState} from "react";

const EventEditForm = ({
	teamDataJsonDraft,
	isTimeBased,
}: {
	teamDataJsonDraft: TeamData[];
	isTimeBased: boolean;
}) => {
	const { mutateEvents } = useDataContext();
	const [isProcessing, setIsProcessing] = useState(false);]

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				if (isProcessing) return;
				setIsProcessing(true);
				await updateEvent(
					Number(
						(document.getElementById("editEventId") as HTMLInputElement).value,
					),
					(document.getElementById("eventName") as HTMLInputElement).value,
					teamDataJsonDraft,
					(document.getElementById("eventDescription") as HTMLInputElement)
						.value,
					isTimeBased,
				);
				await mutateEvents();
				setIsProcessing(false);
			}}
			className="flex items-center mt-4"
		>
			<div className={"flex flex-col justify-start items-start"}>
				<input
					type="text"
					name="editEventId"
					id="editEventId"
					className="border border-gray-400 px-4 py-2 mr-2 rounded text-black"
					placeholder="ID"
				/>
				<LoadingButton
					type="submit"
					className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded"
					onClick={() => {}}
					disabled={isProcessing}
				>
					編集
				</LoadingButton>
			</div>
		</form>
	);
};

export default EventEditForm;
