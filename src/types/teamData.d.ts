interface TeamData {
    type: string
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