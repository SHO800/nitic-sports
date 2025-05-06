"use client"
import {useData} from "@/hooks/data";

type TeamDataInputProps = {
    index: number;
    eventType: string | null;
    teamDataJsonDraft: TeamData[];
    setTeamDataJsonDraft: (data: TeamData[]) => void;
    addTournamentTeamsFromPlans: (index: number) => void;
}

const TeamDataInput = ({
                           index,
                           eventType,
                           teamDataJsonDraft,
                           setTeamDataJsonDraft,
                           addTournamentTeamsFromPlans
                       }: TeamDataInputProps) => {
    const {getMatchDisplayStr} = useData();


    if (eventType === "tournament") {
        const teamDataJsonDraftElement = teamDataJsonDraft[index];
        if (teamDataJsonDraftElement.type !== "tournament") return null;
        const teamData = teamDataJsonDraftElement.teams;
        return (

            <>
                {teamData.map((key, idx) => (
                    <div key={`teamDataJsonDraft[${index}]TournamentDiv${idx}`}
                         className={""}>
                        <button onClick={() => {
                            const newTeamData = [...teamDataJsonDraft]
                            const teamDataElem = newTeamData[index]
                            if ("teams" in teamDataElem){
                                teamDataElem.teams.splice(idx, 1)
                                setTeamDataJsonDraft(newTeamData)
                            }
                        }}>削除</button>
                        <input
                            type="text"
                            name={`team${idx}`}
                            id={`team${idx}`}
                            className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                            placeholder='チーム名を入力してください'
                            value={key.teamId}
                            onChange={(e) => {
                                const newTeamData = [...teamDataJsonDraft];
                                const teamDataElem = newTeamData[index];

                                if ("teams" in teamDataElem) {
                                    teamDataElem.teams[idx] = {
                                        teamId: e.target.value,
                                    };
                                }
                                setTeamDataJsonDraft(newTeamData);
                            }}
                        />
                        <span
                            className={`text-black `}>
                            {getMatchDisplayStr(key.teamId)}
                        </span>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => {
                        console.log(teamDataJsonDraft)
                        const newTeamData = [...teamDataJsonDraft];
                        const teamDataElem = newTeamData[index];
                        if ("teams" in teamDataElem) {
                            teamDataElem.teams.push({
                                teamId: "0",
                            });
                        }
                        setTeamDataJsonDraft(newTeamData);
                    }}
                    className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                >
                    チーム追加
                </button>
                <button
                    type="button"
                    onClick={() => addTournamentTeamsFromPlans(index)}
                    className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                >
                    試合プランからチームを追加
                </button>
            </>
        );
    } else {
        const teamDataJsonDraftElement = teamDataJsonDraft[index];
        if (teamDataJsonDraftElement.type !== "league") return null;
        return (
            <>
                {
                    Object.keys(teamDataJsonDraftElement.blocks).map((key, blockIndex) => (
                        <div key={`teamDataJsonDraft[${index}]LeagueDiv${blockIndex}`}
                             className={"flex flex-col"}>
                            <p>{key}</p>
                            {teamDataJsonDraftElement.blocks[key].map((team, teamIndex) => (
                                <input
                                    key={`teamDataJsonDraft[${index}]LeagueInput${blockIndex}${teamIndex}`}
                                    type="text"
                                    name={`team${blockIndex}-${teamIndex}`}
                                    id={`team${blockIndex}-${teamIndex}`}
                                    className='border border-gray-400 px-4 py-2 mr-2 rounded text-black'
                                    placeholder='IDを入力してください'
                                    onChange={(e) => {
                                        const newTeamData = [...teamDataJsonDraft];
                                        const teamDataElem = newTeamData[index];
                                        if ("blocks" in teamDataElem) {
                                            teamDataElem.blocks[key][teamIndex] = {
                                                teamId: e.target.value,
                                            };
                                        }
                                        setTeamDataJsonDraft(newTeamData);
                                    }}
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    const newTeamData = [...teamDataJsonDraft];
                                    const teamDataElem = newTeamData[index];
                                    if ("blocks" in teamDataElem) {
                                        teamDataElem.blocks[key].push({
                                            teamId: "0",
                                        });
                                    }
                                    setTeamDataJsonDraft(newTeamData);
                                }}
                                className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                            >
                                チーム追加
                            </button>
                        </div>
                    ))
                }
                <button
                    type="button"
                    onClick={() => {
                        const newTeamData = [...teamDataJsonDraft];
                        const teamDataElem = newTeamData[index];


                        if ("blocks" in teamDataElem) {
                            const blockName = String.fromCharCode(65 + Object.keys(teamDataElem.blocks).length);
                            teamDataElem.blocks[blockName] = [];
                            setTeamDataJsonDraft(newTeamData);
                        }
                    }}
                    className='bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded'
                >
                    ブロック追加
                </button>
            </>
        );
    }
};

export default TeamDataInput;
