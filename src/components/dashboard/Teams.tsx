"use client";
import { useDataContext } from "@/contexts/dataContext";

const Teams = () => {
	const { teams, mutateTeams } = useDataContext();
	return (
		<>
			{Array.isArray(teams) &&
				teams?.map((team) => (
					<div
						key={team.id}
						className="flex items-center justify-between bg-gray-200 p-2 rounded mb-2"
					>
						<div className="flex items-center">
							<p className={`text-black `}>
								{team.id} {team.name}
							</p>
						</div>
						{/*<button*/}
						{/*    onClick={async (e) => {*/}
						{/*        e.preventDefault()*/}
						{/*        await deleteTeam(team.id)*/}
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
			{/*        await createTeam((document.getElementById('teamName') as HTMLInputElement).value)*/}
			{/*        await mutateTeams();*/}
			{/*    }}*/}
			{/*    className='flex items-center mt-4'*/}
			{/*>*/}
			{/*    <input*/}
			{/*        type='text'*/}
			{/*        id='teamName'*/}
			{/*        name='teamName'*/}
			{/*        className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'*/}
			{/*        placeholder='Teamを入力してください'*/}
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

export default Teams;
