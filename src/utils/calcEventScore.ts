import {Event, MatchPlan, MatchResult} from "@prisma/client";
import {evaluateScore} from "../../public/EvaluateScore";
import {findVariableIdFromNumberId, getSeedCount} from "@/utils/tournamentUtils";

const isSameWinWeight = (a: completedLeagueTeamInfo, b: completedLeagueTeamInfo): boolean => {
    return (
        a.points === b.points &&
        a.goalDifference === b.goalDifference &&
        a.goalsFor === b.goalsFor &&
        a.RockPaperScissors === b.RockPaperScissors
    )
}

// /**
//  * リーグ順位を計算する関数
//  * 優先順位：勝ち点 > 得失点差 > 総得点数
//  */
// const calcTotalLeagueRankings = (teamStats: Record<string, LeagueTeamInfo[]>): {
//     result: completedLeagueTeamInfo[],
//     conflictedTeam?: completedLeagueTeamInfo[][]
// } => {
//     const teamsArray = Object.values(teamStats).flat()
//     const teamsStrictArray: completedLeagueTeamInfo[] =
//         teamsArray
//             .filter(team => team.rank !== undefined && team.points !== undefined && team.goalDifference !== undefined && team.goalsFor !== undefined && team.wins !== undefined)
//             .map(team => ({
//                 ...team,
//                 wins: team.wins ?? 0,
//                 losses: team.losses ?? 0,
//                 draws: team.draws ?? 0,
//                 points: team.points ?? 0,
//                 goalsFor: team.goalsFor ?? 0,
//                 goalsAgainst: team.goalsAgainst ?? 0,
//                 goalDifference: team.goalDifference ?? 0,
//                 teamId: team.teamId,
//                 rank: team.rank!,
//                 provisionalRank: team.provisionalRank ?? 0,
//             }));
//
//     const conflictedTeam: completedLeagueTeamInfo[][] = []
//
//     // チームをソート
//     teamsStrictArray.sort((a, b) => {
//         // ① 勝ち点の数で順位を決める
//         // ② 各チームの勝ち点（勝利：3点、引き分け：1点、敗北：0点）の合計で順位を決める
//         if (a.points !== b.points) {
//             return b.points - a.points;
//         }
//
//         // ③ 勝ち点が同じ場合は得失点差で順位を決める
//         // ④ 勝ち点が同じ場合は、各チームの得失点差の合計で順位を決める。得失点差は、総得点から総失点を引いた数である
//         if (a.goalDifference !== b.goalDifference) {
//             return b.goalDifference - a.goalDifference;
//         }
//
//         // ⑤ 得失点差も同じ場合は総得点数で順位を決める
//         // ⑥ 勝ち点と得失点差が同じ場合は、各チームの総得点数で順位を決める
//         if (a.goalsFor !== b.goalsFor) {
//             return b.goalsFor - a.goalsFor;
//         }
//
//         // ⑦ 総得点差も同じ場合は、じゃんけんをして順位を決める
//         if (a.RockPaperScissors !== undefined && b.RockPaperScissors !== undefined) {
//             return b.RockPaperScissors - a.RockPaperScissors;
//         }
//
//         // じゃんけんも未実施の場合は重複したまま返してクライアントで重複を示す
//         conflictedTeam.push([a, b])
//         return 0;
//     });
//
//     // 順位を付ける
//     teamsStrictArray.forEach((team, index) => {
//         if (index > 0 && isSameWinWeight(team, teamsStrictArray[index - 1])) {
//             team.rank = teamsStrictArray[index - 1].rank;
//         } else {
//             team.rank = index + 1;
//         }
//     });
//
//
//     return {result: teamsStrictArray, conflictedTeam: conflictedTeam.length === 0 ? undefined : conflictedTeam};
// }


const calcTotalTournamentRankings = (
    relatedMatchPlans: MatchPlan[],
    relatedMatchResults: MatchResult[],
    isTimeBased: boolean,
    teamInfos: TeamInfo[]
): Rank[] => {
    // チームのIDリストを取得（重複を排除）
    const teamIds = new Set<number>();
    relatedMatchResults.forEach(result => {
        if (result.teamIds) {
            result.teamIds.forEach(teamId => {
                teamIds.add(teamId);
            });
        }
    });
    // チームの統計情報を初期化
    const teamStats: Record<string, {
        teamId: number;
        wins: number;
        rank: number;
        bestTime?: string;
        bestTimeMs?: number;
    }> = {};

    if (isTimeBased) {
        // 時間制の場合 matchScoresには "hh:mm:ss.sss" (.以下はミリ秒) が入っている

        // チームの初期化（最良タイム用の変数を含む）
        Array.from(teamIds).forEach(teamId => {
            teamStats[teamId] = {
                teamId,
                wins: 0,
                rank: Number.MAX_SAFE_INTEGER,
                bestTime: undefined,
                bestTimeMs: Number.MAX_SAFE_INTEGER
            };
        });

        // 各チームの最良タイムを取得
        relatedMatchResults.forEach(result => {
            result.teamIds.forEach((teamId, index) => {
                const timeString = result.matchScores[index];
                if (!timeString || !teamStats[teamId]) return;

                // timeString形式 "hh:mm:ss.sss" からミリ秒に変換
                const [time, millis] = timeString.split('.');
                const [hours, minutes, seconds] = time.split(':').map(Number);
                const totalMs = (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + (millis ? parseInt(millis) : 0);

                // 現在のベストタイムよりも良い（短い）場合は更新
                if (totalMs < teamStats[teamId].bestTimeMs!) {
                    teamStats[teamId].bestTime = timeString;
                    teamStats[teamId].bestTimeMs = totalMs;
                }
            });
        });


        // チームをタイムの短い順にソート
        let sortedTeams = Object.values(teamStats)
            .filter(team => team.bestTimeMs !== Number.MAX_SAFE_INTEGER)
            .sort((a, b) => a.bestTimeMs! - b.bestTimeMs!);

        // 応急処置... もしタイムレース制でかつ関係のあるマッチが5つ(学年分)なら学年ごとにグループ化する
        // 順位を付ける
        sortedTeams.forEach((team, index) => {
            team.rank = index + 1;
        });
        if (relatedMatchPlans.length === 5) {
            const classCount = 4
            const length = Math.ceil(teamInfos.length / classCount)
            const equallyDividedByFour = new Array(length).fill(0).map((_, i) =>
                teamInfos.slice(i * classCount, (i + 1) * classCount)
            )
            const result = equallyDividedByFour.map(teamsByGrade => {
                return teamsByGrade.map((team) => {
                    return sortedTeams.find(teamWithRank => teamWithRank.teamId.toString() === team.teamId)

                })
                    .filter(e => e !== undefined)
                    .map((teamsByGradeWithRank, index) => {
                        if (teamsByGradeWithRank) teamsByGradeWithRank.rank = index + 1
                        return teamsByGradeWithRank
                    })
            })
            
            sortedTeams = result.flat(1)
        }
        
        // 結果を返す（タイムをdetailに含める）
        return sortedTeams.map(team => ({
            teamId: team.teamId,
            rank: team.rank,
            detail: `タイム: ${team.bestTime}`
        }));

    } else {
        // チームの初期化
        Array.from(teamIds).forEach(teamId => {
            teamStats[teamId] = {
                teamId,
                wins: 0,
                rank: Number.MAX_SAFE_INTEGER // 初期値は大きな数値
            };
        });
        let teamIdsForVariableId: { [key: number]: string | null } = {};
        Object.values(teamStats).forEach(team => {
            teamIdsForVariableId[team.teamId] = findVariableIdFromNumberId(team.teamId, relatedMatchPlans, relatedMatchResults)
        });
        // キーとバリューを逆転
        const variableIdsForTeamId: {
            [key: string]: number
        } = Object.fromEntries(Object.entries(teamIdsForVariableId).map(a => a.reverse()))


        // 勝利数をカウント
        relatedMatchResults.forEach(result => {
            const winnerTeamId = result.winnerTeamId?.toString();
            if (winnerTeamId && teamStats[winnerTeamId]) {
                teamStats[winnerTeamId].wins += 1;
            }
        });

        // seedCountをwinsに加算
        teamInfos.forEach(teamInfo => {
            const teamIdStr = teamInfo.teamId;
            const teamIdNum: number | undefined = variableIdsForTeamId[teamIdStr];
            if (teamIdNum && teamStats[teamIdNum]) teamStats[teamIdNum].wins += getSeedCount(teamIdStr, teamInfos);
        })

        // 決勝戦と3位決定戦を特定
        const finalMatch = relatedMatchPlans.find(match => match.isFinal === true);
        const thirdPlaceMatch = relatedMatchPlans.find(match => match.is3rdPlaceMatch === true);
        // 決勝戦の結果から1位と2位を決定
        if (finalMatch) {
            const finalResult = relatedMatchResults.find(result => result.matchId === finalMatch.id);
            if (finalResult && finalResult.winnerTeamId) {
                // 優勝チーム（1位）
                const winnerTeamId = finalResult.winnerTeamId;
                if (teamStats[winnerTeamId]) {
                    teamStats[winnerTeamId].rank = 1;
                }

                // 準優勝チーム（2位）
                finalResult.teamIds.forEach(teamId => {
                    if (teamId !== winnerTeamId && teamStats[teamId]) {
                        teamStats[teamId].rank = 2;
                    }
                });
            }
        }

        // 3位決定戦の結果から3位と4位を決定
        if (thirdPlaceMatch) {
            const thirdPlaceResult = relatedMatchResults.find(result => result.matchId === thirdPlaceMatch.id);
            if (thirdPlaceResult && thirdPlaceResult.winnerTeamId) {
                // 3位のチーム
                const thirdPlaceTeamId = thirdPlaceResult.winnerTeamId;
                if (teamStats[thirdPlaceTeamId]) {
                    teamStats[thirdPlaceTeamId].rank = 3;
                }

                // 4位のチーム
                thirdPlaceResult.teamIds.forEach(teamId => {
                    if (teamId !== thirdPlaceTeamId && teamStats[teamId]) {
                        teamStats[teamId].rank = 4;
                    }
                });
            }
        }

        // 上位4チーム以外のチームを勝利数で順位付け
        const remainingTeams = Object.values(teamStats).filter(team => team.rank === Number.MAX_SAFE_INTEGER);
        remainingTeams.sort((a, b) => {
            const aInVariableId = teamIdsForVariableId[a.teamId];
            const aTotalWinPoint = a.wins + (aInVariableId ? getSeedCount(aInVariableId, teamInfos) : 0);
            const bInVariableId = teamIdsForVariableId[b.teamId];
            const bTotalWinPoint = b.wins + (bInVariableId ? getSeedCount(bInVariableId, teamInfos) : 0);
            return bTotalWinPoint - aTotalWinPoint;
        });

        // 5位以降を割り当て
        let currentRank = 5;
        let prevWins = -1;


        remainingTeams.forEach((team, index) => {
            const teamInVariableId = teamIdsForVariableId[team.teamId];
            if (index === 0 || (team.wins + (teamInVariableId ? getSeedCount(teamInVariableId, teamInfos) : 0)) !== prevWins) {
                // 勝利数が異なる場合、新しい順位
                currentRank = 5 + index;
            }

            team.rank = currentRank;
            prevWins = team.wins + (teamInVariableId ? getSeedCount(teamInVariableId, teamInfos) : 0);
        });

        return Object.values(teamStats).map(team => ({
            teamId: team.teamId,
            rank: team.rank,
            detail: `勝利数: ${team.wins}`
        }))
    }
}


export const calcEventTotalRankings = (
    event: Event,
    allMatchPlans: MatchPlan[],
    allMatchResults: MatchResult[]
): [Rank[][], boolean] => {

    const eventMatches = allMatchPlans.filter(match => match.eventId === event.id)
    const eventMatchResults = allMatchResults.filter(result => eventMatches.some(match => match.id === result.matchId))
    if (!eventMatches || !eventMatchResults) return [[[]], false];

    // 予選のデータを取得
    const teamDataArray = event.teamData as unknown as TeamData[];
    if (!teamDataArray || teamDataArray.length === 0) return [[[]], false];

    let hasConflict = false
    const ranking: Rank[][] = teamDataArray.map(teamData => {
        if (teamData.type === "league") { // 方式がリーグなら
            const leagueBlocks = teamData.blocks // 予選のブロック情報を取得
            let results: Rank[] = []
            Object.entries(leagueBlocks).forEach(([blockName, teams]) => {
                results = [...teams.map(team => {
                    return {
                        teamId: parseInt(team.teamId),
                        rank: team.rank!,
                        detail: `${blockName}ブロック${team.rank}位`
                    }
                }), ...results
                ]
            })
            return results

        } else { // 方式がトーナメントなら
            const matchPlanIdRange = teamData.matchPlanIdRange
            if (!matchPlanIdRange) return {} as Rank[];
            const relatedMatchPlans = eventMatches.filter(plan => {
                return (matchPlanIdRange.start <= plan.id && plan.id <= matchPlanIdRange.end) || (matchPlanIdRange.additional && matchPlanIdRange.additional.includes(plan.id))
            })
            const relatedMatchPlanIds = relatedMatchPlans.map(plan => plan.id)
            const relatedMatchResults = eventMatchResults.filter(result => relatedMatchPlanIds.includes(result.matchId))

            return calcTotalTournamentRankings(relatedMatchPlans, relatedMatchResults, event.isTimeBased, teamData.teams)
        }
    })

    return [ranking, hasConflict]
}


export const calcEventScore = (event: Event, allMatchPlans: MatchPlan[], allMatchResults: MatchResult[]): RankWithEventScore[][] => {
    const [ranking, hasConflict] = calcEventTotalRankings(event, allMatchPlans, allMatchResults)
    const results: RankWithEventScore[][] = []
    ranking.forEach((roundData, index) => {
        const isQualify = (ranking.length === 2 && index === 0)
        results[index] = roundData.map(team => {
            const teamEventScore = evaluateScore(event.id, team, isQualify)
            return {
                ...team,
                score: teamEventScore
            } as RankWithEventScore
        })
    })
    return results
}


