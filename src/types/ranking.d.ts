interface Ranking {
    position: number;
    teamId: number;
    score: number;
    note: string;
}

interface EventWithRankings {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    rankings: Ranking[];
}