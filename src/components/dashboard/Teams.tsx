"use client"
import {useData} from "@/hooks/data";

const Teams = () => {
    const {teams, setTeams} = useData()
    return (
        <>
            {teams.map((team) => (
                <div
                    key={team.id}
                    className='flex items-center justify-between bg-gray-200 p-2 rounded mb-2'
                >
                    <div className='flex items-center'>
                        <p className={`text-black `}>
                            {team.id} {team.name}
                        </p>
                     </div>
                    <button
                        onClick={async (e) => {
                            e.preventDefault()
                            const response = await fetch(
                                `${process.env.NEXT_PUBLIC_API_URL}/team/${team.id}`,
                                {
                                    method: 'DELETE',
                                }
                            )
                            const deleteTeam = await response.json()
                            setTeams(teams.filter((team) => team.id !== deleteTeam.id))
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
                        `${process.env.NEXT_PUBLIC_API_URL}/team/-1`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: (document.getElementById('teamName') as HTMLInputElement).value,
                            }),
                        }
                    )
                    const newTeam = await response.json()

                    setTeams([...teams, newTeam])
                }}
                className='flex items-center mt-4'
            >
                <input
                    type='text'
                    id='teamName'
                    name='teamName'
                    className='border border-gray-400 px-4 py-2 mr-2 rounded text-white'
                    placeholder='Teamを入力してください'
                />
                <button
                    type='submit'
                    className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
                >
                    追加
                </button>
            </form>
        </>
    )
}

export default Teams;