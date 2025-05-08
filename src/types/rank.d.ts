
interface Rank {
    teamId: number,
    rank: number,
    detail?: completedLeagueTeamInfo | string
}

interface RankWithEventScore extends Rank{
    score: number
}