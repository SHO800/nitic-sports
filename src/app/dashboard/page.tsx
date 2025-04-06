"use client"

import {useEffect, useState} from "react";
import {Team, Event, EventSchedule, Match, ScheduleImage, Location, Score} from "@prisma/client";
import ClassSelector from "@/components/common/ClassSelector";

const Dashboard = () => {
    const [inputValue, setInputValue] = useState<string | null>(null)
    const [teams, setTeams] = useState<Team[]>([])
    
    const [events, setEvents] = useState<Event[]>([])
    const [eventSchedules, setEventSchedules] = useState<EventSchedule[]>([])
    const [matchs, setMatchs] = useState<Match[]>([])
    const [schedules, setSchedules] = useState<ScheduleImage[]>([])
    const [locations, setLocations] = useState<Location[]>([])
    const [scores, setScores] = useState<Score[]>([])
    

    useEffect(() => {
        const getTeam = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/-1`)
            const teams = await response.json()
            setTeams(teams)
        }
        getTeam()
        
        const getEvent = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`)
            const events = await response.json()
            setEvents(events)
        }
        
        
        
    }, [])

    return (
        <div>
            <details className='container mx-auto p-4'>
                <summary className='text-3xl font-bold mb-4'>クラス</summary>
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className='flex items-center justify-between bg-gray-200 p-2 rounded mb-2'
                    >
                        <div className='flex items-center'>
                            <p className={`text-black `}>
                                {team.name}
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
                        if (!inputValue) alert('入力してください')
                        const response = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/team`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({name: inputValue}),
                            }
                        )
                        const newTeam = await response.json()

                        setTeams([...teams, newTeam])
                        setInputValue(null)
                    }}
                    className='flex items-center mt-4'
                >
                    <input
                        type='text'
                        className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                        value={inputValue ?? ''}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='Teamを入力してください'
                    />
                    <button
                        type='submit'
                        className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
                    >
                        追加
                    </button>
                </form>
                <ClassSelector
                    callback={(id: number, name: string) => {
                        console.log(id, name);
                    }}
                />
            </details>
            
            <details className='container mx-auto p-4'>
                <summary className='text-3xl font-bold mb-4'>種目</summary>
            </details>
            
            <details className='container mx-auto p-4'>
                <summary className='text-3xl font-bold mb-4'>試合</summary>
                
            </details>
        </div>
    )
}

export default Dashboard;