interface TeamData {
    type: string
    matchPlanIdRange?: {
        start: number
        end: number
        additional?: number[]
    }
    blocks?: {
        [key: string]:
            {
                teamId: string
                rank?: number
            }[]
    }
    teams?:
        {
            teamId: string
            rank?: number
        }[]
}