"use client";
import { useDataContext } from "@/contexts/dataContext";

const Location = () => {
	const { locations } = useDataContext();
	return (
		<>
			{locations?.map((location) => (
				<div
					key={location.id}
					className="flex items-center justify-between bg-gray-200 p-2 rounded mb-2"
				>
					<div className="flex items-center">
						<p className={"text-black "}>
							{location.id} {location.name}
						</p>
					</div>
					{/*<button*/}
					{/*    onClick={async (e) => {*/}
					{/*        e.preventDefault()*/}
					{/*        await deleteLocation(location.id)*/}
					{/*        await mutateLocations();*/}
					{/*    }}*/}
					{/*    className='bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded'*/}
					{/*>*/}
					{/*    削除*/}
					{/*</button>*/}
				</div>
			))}
			{/*<form*/}
			{/*    onSubmit={async (e) => {*/}
			{/*        e.preventDefault()*/}
			{/*        await createLocation(*/}
			{/*            (document.getElementById('locationName') as HTMLInputElement).value,*/}
			{/*            {} as any, // TODO: locationの座標を取得する*/}
			{/*            undefined*/}
			{/*        )*/}
			{/*        await mutateLocations();*/}
			{/*    }}*/}
			{/*    className='flex items-center mt-4'*/}
			{/*>*/}
			{/*    <input*/}
			{/*        type='text'*/}
			{/*        id='locationName'*/}
			{/*        name='locationName'*/}
			{/*        className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'*/}
			{/*        placeholder='会場名を入力してください'*/}
			{/*    />*/}
			{/*    <button*/}
			{/*        type='submit'*/}
			{/*        className='bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded'*/}
			{/*    >*/}
			{/*        追加*/}
			{/*    </button>*/}
			{/*</form>*/}
		</>
	);
};

export default Location;
