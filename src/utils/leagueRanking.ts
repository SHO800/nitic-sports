import {prisma} from '@/../lib/prisma';

// リーグ順位計算用のチーム統計データ
interface TeamRankingData {
  teamId: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

/**
 * リーグ内の順位を計算して更新する
 */
export async function updateLeagueRankings(eventId: number, matchId: number): Promise<boolean> {
  try {
    // 試合情報を取得
    const matchPlan = await prisma.matchPlan.findUnique({
      where: { id: matchId },
      include: { matchResult: true }
    });

    if (!matchPlan || !matchPlan.matchResult) {
      return false;
    }

    // イベント情報を取得
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event || !event.teamData || !Array.isArray(event.teamData) || event.teamData.length === 0) {
      return false;
    }

    // JSON型からTypeScriptの型に変換
    const teamDataArray = event.teamData as unknown as TeamData[];

    // リーグ形式のデータを見つける
    const leagueDataIndex = teamDataArray.findIndex(
      (data) => data.type === 'league' && data.blocks && Object.keys(data.blocks).length > 0
    );

    if (leagueDataIndex === -1) {
      return false; // リーグ形式のデータが見つからない
    }

    const leagueData = teamDataArray[leagueDataIndex] as LeagueTeamData;
    
    // 試合結果に関連するブロックを特定
    const blockName = findBlockByMatch(
      leagueData.blocks, 
      matchPlan.matchResult.teamIds.map(id => id.toString())
    );
    
    if (!blockName) {
      return false; // この試合に関連するブロックが見つからない
    }
    
    // ブロック内の全チームのIDを取得
    const blockTeams: string[] = leagueData.blocks[blockName].map((team: LeagueTeamInfo) => team.teamId);
    // 数値IDを持つチームのみフィルタリング（変数IDは除外）
    const numericTeamIds = blockTeams
      .filter(id => !id.startsWith('$'))
      .map(id => parseInt(id));
    
    // ブロック内の全チームの試合結果を取得して順位を計算
    const { rankings, blockStatus } = await calculateBlockRankings(eventId, numericTeamIds);
    
    // 計算された順位でteamDataを更新
    const updatedBlocks = { ...leagueData.blocks };
    
    // 既存のブロックデータを保持
    const existingBlockData = [...updatedBlocks[blockName]];
    
    // blockStatusの初期化または更新
    const updatedBlockStatus = leagueData.blockStatus || {};
    updatedBlockStatus[blockName] = blockStatus;

    // 数値IDを持つチームの情報を更新
    updatedBlocks[blockName] = existingBlockData.map(teamInfo => {
      if (teamInfo.teamId.startsWith('$')) {
        // 変数IDのチームはそのまま保持
        return teamInfo;
      }

      const teamId = parseInt(teamInfo.teamId);
      const ranking = rankings.find(r => r.teamId === teamId);

      if (ranking) {
          const rankPosition = rankings.findIndex(r => r.teamId === teamId) + 1;

          // 基本的な統計情報を更新
          const updatedTeamInfo: LeagueTeamInfo = {
          ...teamInfo,
          teamId: teamInfo.teamId, // 文字列形式を維持
          wins: ranking.wins,
          losses: ranking.losses,
          draws: ranking.draws,
          points: ranking.points,
          goalsFor: ranking.goalsFor,
          goalsAgainst: ranking.goalsAgainst,
          goalDifference: ranking.goalDifference,
            // 暫定順位は常に更新
            provisionalRank: rankPosition
        };
        // 全試合完了時のみrankを設定、そうでない場合はrankを削除
        if (blockStatus.completed) {
          updatedTeamInfo.rank = rankPosition;
        } else if (updatedTeamInfo.rank !== undefined) {
          // rankが設定されていたら削除（まだ全試合が終わっていない）
          delete updatedTeamInfo.rank;
        }

        return updatedTeamInfo;
      }

      return teamInfo;
    });
    
    // イベントのteamDataを更新
    const updatedTeamData = [...teamDataArray];
    updatedTeamData[leagueDataIndex] = {
      ...leagueData,
      blocks: updatedBlocks,
      blockStatus: updatedBlockStatus
    };
    
    // データベースを更新
    await prisma.event.update({
      where: { id: eventId },
      data: { teamData: JSON.parse(JSON.stringify(updatedTeamData)) }
    });

    console.log(`ブロック "${blockName}" 状態: 完了=${blockStatus.completed}, 試合=${blockStatus.completedMatches}/${blockStatus.totalMatches}`);
    
    return true;
  } catch (error) {
    console.error('リーグ順位の更新中にエラーが発生しました:', error);
    return false;
  }
}

/**
 * チームIDがあるブロックを見つける
 */
function findBlockByMatch(
  blocks: Record<string, LeagueTeamInfo[]>, 
  teamIds: string[]
): string | null {
  for (const [blockName, teams] of Object.entries(blocks)) {
    const blockTeamIds = teams.map(team => team.teamId);
    // 試合の両チームがこのブロックに属しているかチェック
    const isMatchInBlock = teamIds.every(id => blockTeamIds.includes(id));
    
    if (isMatchInBlock) {
      return blockName;
    }
  }
  
  return null;
}

/**
 * ブロック内の全試合が完了したかチェックする
 */
async function isBlockCompleted(eventId: number, teamIds: number[]): Promise<{
  completed: boolean;
  totalMatches: number;
  completedMatches: number;
}> {
  // ブロック内に存在するべき総試合数を計算（チーム数から総当たり戦の試合数を算出）
  const totalTeams = teamIds.length;
  const totalMatches = (totalTeams * (totalTeams - 1)) / 2; // n*(n-1)/2

  // このブロックの試合（完了・未完了を含む）を取得
  const blockMatchPlans = await prisma.matchPlan.findMany({
    where: {
      eventId,
      // このブロックのチームが含まれる試合を検索
      OR: teamIds.map(teamId => ({
        teamIds: {
          has: teamId.toString()
        }
      }))
    }
  });

  // ブロック内のチーム同士の試合のみをフィルタリング
  const blockMatches = blockMatchPlans.filter(match => {
    const matchTeamIds = match.teamIds.map(id => {
      const numId = parseInt(id);
      return isNaN(numId) ? -1 : numId;
    });

    // この試合の両方のチームがブロックに所属しているか確認
    const teamsInBlock = matchTeamIds.filter(id => teamIds.includes(id));
    return teamsInBlock.length >= 2; // ブロック内の試合
  });

  // 完了した試合数を計算
  const completedMatches = blockMatches.filter(match => match.status === 'Completed').length;

  return {
    completed: completedMatches === totalMatches,
    totalMatches,
    completedMatches
  };
}

/**
 * ブロック内のチームの順位を計算
 */
async function calculateBlockRankings(eventId: number, teamIds: number[]): Promise<{
  rankings: TeamRankingData[];
  blockStatus: {
    completed: boolean;
    totalMatches: number;
    completedMatches: number;
  };
}> {
  // ブロックの完了状態を確認
  const blockStatus = await isBlockCompleted(eventId, teamIds);

  // このブロック内の全チームの試合結果を取得
  const matchPlans = await prisma.matchPlan.findMany({
    where: {
      eventId,
      status: 'Completed',
    },
    include: {
      matchResult: true
    }
  });
  
  // チームごとの成績データを初期化
  const teamStats: Record<number, TeamRankingData> = {};
  teamIds.forEach(teamId => {
    teamStats[teamId] = {
      teamId,
      wins: 0,
      losses: 0,
      draws: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0
    };
  });
  
  // 試合結果からチームの成績を集計
  for (const match of matchPlans) {
    if (!match.matchResult) continue;
    
    const { teamIds: matchTeamIds, matchScores, winnerTeamId } = match.matchResult;
    
    // この試合が指定されたブロック内のチーム同士の試合かどうかを確認
    const teamsInBlock = matchTeamIds.filter(id => teamIds.includes(id));
    if (teamsInBlock.length < 2) continue; // ブロック内の試合ではない
    
    // スコア解析（文字列から数値へ）
    const scores = matchScores.map(score => {
      const numScore = parseInt(score);
      return isNaN(numScore) ? 0 : numScore;
    });
    
    // 引き分けかどうかの判定（ここは競技によって異なる可能性あり）
    const isDraw = scores.length >= 2 && scores[0] === scores[1];
    
    // 各チームの成績を更新
    for (let i = 0; i < matchTeamIds.length; i++) {
      const teamId = matchTeamIds[i];
      if (!teamIds.includes(teamId)) continue; // このブロックのチームではない
      
      const teamStat = teamStats[teamId];
      if (!teamStat) continue;
      
      // 得点・失点を更新
      if (scores.length > i) {
        teamStat.goalsFor += scores[i];
        // 失点は相手チームの得点
        const opponentScores = scores.filter((_, index) => index !== i);
        teamStat.goalsAgainst += opponentScores.reduce((sum, score) => sum + score, 0);
      }
      
      // 勝敗を更新
      if (isDraw) {
        teamStat.draws += 1;
        teamStat.points += 1; // 引き分けは1ポイント
      } else if (teamId === winnerTeamId) {
        teamStat.wins += 1;
        teamStat.points += 3; // 勝利は3ポイント
      } else {
        teamStat.losses += 1;
        // 敗北はポイントなし
      }
      
      // 得失点差を更新
      teamStat.goalDifference = teamStat.goalsFor - teamStat.goalsAgainst;
    }
  }
  
  // 順位付けのためにソート（ポイント、得失点差、得点数の順）
  const rankings = Object.values(teamStats).sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points;
    if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return {
    rankings,
    blockStatus
  };
}
