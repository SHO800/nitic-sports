import React from "react";

type MatchResultTableProps = {
  teamIds: number[];
  matchScores: (string | number)[];
  winnerTeamId: number | null;
  getMatchDisplayStr: (teamId: string) => string;
  eventIsTimeBased: boolean;
  matchTime: number;
  resultNote?: string;
};

const MatchResultTable: React.FC<MatchResultTableProps> = ({
  teamIds,
  matchScores,
  winnerTeamId,
  getMatchDisplayStr,
  eventIsTimeBased,
  matchTime,
  resultNote,
}) => (
  <div className="text-black w-full flex flex-col items-center">
    {matchTime >= 0 ? <p className={"text-center"}>試合時間: {matchTime}分</p> : null}
    <table className={"mt-1 mb-2 mx-auto w-2/3 border-y-2 border-gray-400"}>
      <thead>
        <tr className={"w-full border-y-2 border-gray-400"}>
          <th scope={"col"} className={"w-1/3"}>
            所属
          </th>
          <th scope={"col"} className={"w-1/3 "}>
            {eventIsTimeBased ? " " : "スコア"} 
          {/*  タイムはなしに*/}
          </th>
          <th scope={"col"} className={"w-1/3 "}>
            勝利
          </th>
        </tr>
      </thead>
      <tbody>
        {teamIds.map((teamId: number, index: number) => (
          <tr
            key={`matchResultTeam${index}`}
            className={"h-8 text-[1.1em] py-2"}
          >
            <td>
              <p className={"text-center"}>{getMatchDisplayStr(teamId.toString())}</p>
            </td>
            <td>
              {/*@ts-ignore*/}
              <p className={"text-center"}>{ eventIsTimeBased ? (matchScores[index].toString())[0]+"位" : matchScores[index]}</p>
            </td>
            <td>
              <p className={"text-center"}>
                {winnerTeamId === teamId ? <span className="ml-1"> ○ </span> : null}
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {resultNote && resultNote.length > 0 ? <p>試合結果メモ: {resultNote}</p> : null}
  </div>
);

export default MatchResultTable;

