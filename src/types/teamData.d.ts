interface TeamData {
    type: string
    blocks?: {
        [key: string]:
            {
                teamId: number
                rank?: number
            }[]
    }
    teams?:
        {
            teamId: number
            rank?: number
        }[]
}