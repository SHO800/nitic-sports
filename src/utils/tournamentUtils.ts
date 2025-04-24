import {Event, MatchPlan, Team} from '@prisma/client';
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";

export type TournamentNode = {
    matchId: number;
    teamIds: string[]; // チームID
    matchPlan: MatchPlan;
    round: number; // ラウンド数
    row: number; // 行数
    debug?: string; // デバッグ用
    position: number; // 同じラウンド内での位置
    premiseNode?: [TournamentNode | string[] | null, TournamentNode | string[] | null]; // 前提とする試合のノードまたは前提とする試合を含むId
}

export const implementsTournamentNode = (obj: any): obj is TournamentNode => {
    return (
        obj &&
        typeof obj.matchId === 'number' &&
        obj.teamIds && 
        Array.isArray(obj.teamIds) &&
        typeof obj.round === 'number' &&
        typeof obj.row === 'number' &&
        typeof obj.position === 'number' &&
        (obj.premiseNode === undefined || Array.isArray(obj.premiseNode))
    );
}

export interface TournamentData {
    rounds: number;
    matches: TournamentNode[];
    teamMap: Record<number, { name: string; color?: string }>;
}


/**
 * イベントデータからトーナメントの構造を構築する
 */
export const  buildTournamentBracket = (
    event: Event,
    relatedMatchPlans: MatchPlan[],
    allMatchPlans: MatchPlan[],
    teams: Team[],
    isFinal: boolean,
): TournamentData | null => {
    if (!event || !relatedMatchPlans || !teams) {
        return null;
    }

    // チームデータのインデックス(予選:0, 本選:1)
    const teamDataIndex = isFinal ? 1 : 0;

    // イベントからトーナメントデータを取得
    const tournamentData = Array.isArray(event.teamData) && event.teamData.length > teamDataIndex
        ? event.teamData[teamDataIndex] as unknown as TeamData
        : null;

    if (!tournamentData || tournamentData.type !== 'tournament') {
        return null;
    }

    // チームマップの作成
    const teamMap: Record<number, { name: string; color?: string }> = {};
    teams.forEach(team => {
        teamMap[team.id] = {name: team.name, color: team.color || undefined};
    });

    const tournamentMatches = relatedMatchPlans.toSorted((a, b) => a.id - b.id);

    // トーナメントの深さ（ラウンド数）を計算
    const teamIds = tournamentData.teams ? tournamentData.teams.map(t => t.teamId) : [];
    const rounds = Math.ceil(Math.log2(teamIds.length || 1))

    // トーナメントノードを構築
    const tournamentNodes = constructTournament(
        tournamentMatches, // 予選の試合プラン
        allMatchPlans,
    );
    
    // トーナメントノードをソート
    tournamentNodes.sort((a, b) => a.round - b.round || a.position - b.position);
    // 各ノードに行数を追加
    
    // TODO: 準々決勝とかのrowの計算がうまく行っておらず全部2とかになる このnodeでのrowの更新がuseStateみたいに途中で行われないのかもしれない
    // tournamentNodes.forEach((node, index) => {
    for (let index = 0; index < tournamentNodes.length; index++) {
        // const node = tournamentNodes[index];
            //     依存先
            const dependenciesReplica = tournamentNodes[index].premiseNode?.filter((premise) => premise !== null)  // これは各Nodeに複製されたほうのNode, 最新のNodeではない
                    
        
            if (!dependenciesReplica) {
                tournamentNodes[index].row = index * 2 -1;
                tournamentNodes[index].debug = "cant find dep";
                continue;
            }
            const dependencies =  dependenciesReplica?.map((premise) => {
                if ("length" in premise) return premise
                return tournamentNodes.find(value => value.matchId === premise?.matchId) 
            }).filter(value => value !== undefined)
        
            // トーナメント外依存先の数 string[]を含んでいる数
            const  externalDependenciesLength = dependencies.filter(depNode => "length" in depNode).length
            if ( dependencies.length === 0 || externalDependenciesLength >= 2) {
                tournamentNodes[index].row = index * 2 +1;
                tournamentNodes[index].debug = "no dependencies";
            }else if (dependencies.length < 3) {
                if (dependencies.length === 1) { // 片方のチームは固定, もう片方は動的な場合
                    tournamentNodes[index].debug = "one dependency";
                    const internalDependency = dependencies[0] as TournamentNode;
                    
                    
                    if (dependencies.indexOf(dependencies[0]) === 0) {
                        //上側依存なら下向きに出る
                        tournamentNodes[index].row = internalDependency.row  + 1;
                        tournamentNodes[index].debug = "one dependency 1";
                    }
                    else if (dependencies.indexOf(dependencies[0]) > 0) {
                        //下側依存なら上向きに出る
                        tournamentNodes[index].row = internalDependency.row  - 1;
                        tournamentNodes[index].debug = "one dependency 2";
                    }
                    else {
                        console.log("not found")
                    }
                }
                else if (externalDependenciesLength === 0) {
                    tournamentNodes[index].debug = "two internal dependencies";
                    // どちらも内部依存ならば、上の試合の行数の平均
                    const internalDependency1 = dependencies[0] as TournamentNode;
                    const internalDependency2 = dependencies[1] as TournamentNode;
                    tournamentNodes[index].row = Math.floor((internalDependency1.row + internalDependency2.row) / 2);
                }
                else if (externalDependenciesLength === 1) {
                    if ( "length" in dependencies[0] && !("length" in  dependencies[1])) {
                        // 0番目のチームが外部依存なら内部依存試合の上に出る
                        tournamentNodes[index].debug = "one external dependency 1";
                        const internalDependency = dependencies[1];
                        tournamentNodes[index].row = internalDependency.row -1;
                    } else if ( "length" in dependencies[1]  &&  !("length" in  dependencies[0]) ) {
                        // 1番目のチームが外部依存なら内部依存試合の下に出る
                        tournamentNodes[index].debug = "one external dependency 2";
                        const internalDependency = dependencies[0];
                        tournamentNodes[index].row = internalDependency.row +1 ;
                    }
                }
            } else { // 2つより多い場合
                // 全ての依存先の行数の平均を取る
                tournamentNodes[index].debug = "more than two dependencies";
                const internalDependencies = dependencies.filter(depNode => !("length" in depNode)) as TournamentNode[];
                const sum = internalDependencies.reduce((acc, depNode) => acc + depNode.row, 0);
                const average = Math.floor(sum / internalDependencies.length);
                tournamentNodes[index].row = average * 2 + 1;
            }
    }


    return {
        rounds,
        matches: tournamentNodes,
        teamMap
    };
}

/**
 * 試合データからトーナメント構造を構築する。
 * 結果は考慮せず, 形状のみ。
 */
function constructTournament(
    relatedMatchPlans: MatchPlan[],
    allMatchPlans: MatchPlan[],
): TournamentNode[] {
    const nodes: TournamentNode[] = [];

    // 試合IDをキーにした試合データのマッピングを作成。渡されたmatchPlansと中身は同じ。
    const matchPlanMap = new Map();
    relatedMatchPlans.forEach(matchPlan => {
        matchPlanMap.set(matchPlan.id, matchPlan);
    });

    const allMatchPlanMap = new Map();
    allMatchPlans.forEach(matchPlan => {
        allMatchPlanMap.set(matchPlan.id, matchPlan);
    });


    // 渡された, このトーナメントに関連する全ての試合について繰り返す
    relatedMatchPlans.forEach(matchPlan => {
        // 試合ノードを作成
        const matchNode: TournamentNode = {
            matchId: matchPlan.id,
            teamIds: matchPlan.teamIds,
            matchPlan,
            row: 0, // 初期値
            round: calculateRound(matchPlan, relatedMatchPlans),
            position: calculatePosition(matchPlan, relatedMatchPlans),
            premiseNode: [null, null]

        };

        // チームIDを解析して、何かの試合を前提としているならそのidを指定
        matchPlan.teamIds.forEach((teamId: string, index: number) => {
            if (teamId.startsWith('$')) { // 何かの試合を前提としているなら
                const analyzed = analyzeVariableTeamId(teamId); // 分析して
                if (!analyzed) return;
                if (analyzed.type === 'T') { // あるトーナメント制の試合結果に依存する場合
                    const referencedMatchId = analyzed.matchId; // その依存先の試合idを取得しておき
                    if (matchPlanMap.has(referencedMatchId)) { // その依存先の試合がこのトーナメント内の試合であるならば
                        const referencedMatch = matchPlanMap.get(referencedMatchId); // その依存先の試合のデータを取得
                        matchNode.premiseNode![index] = { // この試合の依存関係にその参照先の試合情報を追加
                            matchId: referencedMatch.id,
                            teamIds: referencedMatch.teamIds,
                            matchPlan: referencedMatch,
                            row: 0, // 初期値
                            round: calculateRound(referencedMatch, relatedMatchPlans),
                            position: calculatePosition(referencedMatch, relatedMatchPlans),
                            premiseNode: [null, null]
                        };

                    } else { // その依存先の試合がこのトーナメント内の試合でないならば
                        // 依存関係にその試合の情報を含むチーム名を追加
                        matchNode.premiseNode![index] = [teamId];
                    }
                } else { // あるリーグ制の試合結果に依存する場合
                    // このトーナメント内の試合には依存していないことが明らかなので、依存関係にその試合情報を含むチーム名を追加.
                    matchNode.premiseNode![index] = [teamId];
                }
            } else { // なにかの試合を前提としていない (直接チームidが指定されている) 場合は依存関係がない

            }

        })
        nodes.push(matchNode); // 試合ノードを追加

    });

    return nodes;
}


/**
 * 試合のラウンドを計算
 */
function calculateRound(match: MatchPlan, allMatches: MatchPlan[]): number {
    // 参照関係からラウンド数を推定
    const dependencies = match.teamIds.filter((id: string) =>
        typeof id === 'string' && id.startsWith('$T-')).length;

    if (dependencies === 0) {
        return 1; // 初戦
    } else {
        // 参照している試合から最大ラウンドを計算
        let maxRound = 0;
        match.teamIds.forEach((teamId: string) => {
            if (typeof teamId === 'string' && teamId.startsWith('$T-')) {
                const parts = teamId.split('-');
                const referencedMatchId = parseInt(parts[1], 10);
                const referencedMatch = allMatches.find(m => m.id === referencedMatchId);
                if (referencedMatch) {
                    const round = calculateRound(referencedMatch, allMatches);
                    maxRound = Math.max(maxRound, round);
                }
            }
        });
        return maxRound + 1;
    }
}

/**
 * 試合の位置（同じラウンド内での順序）を計算
 */
function calculatePosition(match: MatchPlan, allMatches: MatchPlan[]): number {
    const sameRoundMatches = allMatches.filter(m =>
        calculateRound(m, allMatches) === calculateRound(match, allMatches));
    return sameRoundMatches.indexOf(match);
}
    