import {TournamentData} from "@/utils/tournamentUtils";

/**
 * トーナメントの各ラウンドのマッチを処理するユーティリティ関数
 *
 * @param tournamentData トーナメントデータ
 * @param maxRowNum 最大行数
 * @returns ラウンドごとのマッチ情報
 */
export function processRoundMatches(tournamentData: TournamentData, maxRowNum: number) {
    
    return Array.from({length: tournamentData.rounds}).map((_, roundIndex) => {
        const roundNumber = roundIndex + 1;
        const roundMatches = tournamentData.matches
            .filter(match => match.round === roundNumber)
            .sort((a, b) => a.position - b.position);

        const roundMatchesWithSpace = Array.from(
            {length: maxRowNum},
            (_, index) => roundMatches.find(m => m.row - 1 === index)
        );

        return {
            roundNumber,
            roundMatchesWithSpace
        };
    })
}
