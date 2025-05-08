// がんばればEventに構文化したstring置いて一般化できそうだけど時間がないので関数にベタ書きしよう.

enum EventCorresponding { // eventにstringを置ければ本来不要で冗長なもの. 移行する場合は削除. 
    Badminton = 1,
    TableTennis = 2,
    Volleyball = 3,
    Basketball = 4,
    SoftTennis = 5,
    SoftBall = 6,
    Soccer = 7,
    Relay = 8
}

export const evaluateScore = (eventId: number, rankDetail: Rank, isQualifying: boolean) => {
    const rank = rankDetail.rank
    let score = 0;
    switch (eventId) {
        // ①	バドミントン、ソフトテニス
        // 1位	1000点
        // 2位	800点
        // 3位	600点
        // 4位	500点
        // ベスト8	400点
        // 予選2位	200点
        // 予選3位	100点
        case EventCorresponding.Badminton:
        case EventCorresponding.SoftTennis:
            if (isQualifying) { // 予選
                if (rank === 2) score = 200;
                else if (rank === 3) score = 100;
            } else { // 本戦
                if (rank === 1) score = 1000;
                else if (rank === 2) score = 800;
                else if (rank === 3) score = 600;
                else if (rank === 4) score = 500;
                else if (rank >= 8) score = 400;
            }
            break;

        // ②	バスケットボール
        // 1位	1000点
        // 2位	800点
        // ベスト4	500点
        // ベスト８	300点
        // 予選2位	200点
        // 予選3位	100点
        case EventCorresponding.Basketball:
            if (isQualifying) { // 予選
                if (rank === 2) score = 200;
                else if (rank === 3) score = 100;
            } else { // 本戦
                if (rank === 1) score = 1000;
                else if (rank === 2) score = 800;
                else if (rank >= 4) score = 500;
                else if (rank >= 8) score = 300;
            }
            break;

        // ③	選抜リレー
        // 1位	400点
        // 2位	350点
        // 3位	300点
        // 4位	250点
        // 5位	200点
        // 予選2位	50点
        case EventCorresponding.Relay:
            if (isQualifying) { // 予選
                if (rank === 2) score = 50;
            } else { // 本戦
                if (rank === 1) score = 400;
                else if (rank === 2) score = 350;
                else if (rank === 3) score = 300;
                else if (rank === 4) score = 250;
                else if (rank === 5) score = 200;
            }
            break;

        // ④	バレーボール
        // 1位	1000点
        // 2位	800点
        // ベスト4	500点
        // ベスト8	300点
        // ベスト16	100点
        case EventCorresponding.Volleyball:
            // 予選なし
            if (rank === 1) score = 1000;
            else if (rank === 2) score = 800;
            else if (rank >= 4) score = 500;
            else if (rank >= 8) score = 300;
            else if (rank >= 16) score = 100;
            break;

        // ⑤	ソフトボール、サッカー、卓球
        // 1位	1000点
        // 2位	800点
        // 3位	600点
        // 4位	500点
        // ベスト8	300点
        // ベスト16	100点
        case EventCorresponding.SoftBall:
        case EventCorresponding.Soccer:
        case EventCorresponding.TableTennis:
            // 予選なし
            if (rank === 1) score = 1000;
            else if (rank === 2) score = 800;
            else if (rank === 3) score = 600;
            else if (rank === 4) score = 500;
            else if (rank >= 8) score = 300;
            else if (rank >= 16) score = 100;
            break;
    }
    // 該当がない場合は0のまま.
    return score;
}
