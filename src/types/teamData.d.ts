// 競技種目のタイプを表すリテラル型
type CompetitionType = 'tournament' | 'league';

// チーム情報の基本インターフェース
interface TeamInfo {
  teamId: string;
  rank?: number;
}

// リーグ形式のチーム情報を拡張したインターフェース
interface LeagueTeamInfo extends TeamInfo {
  // 勝敗データ
  wins?: number;
  losses?: number;
  draws?: number;
  points?: number;
  // 得点データ
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  // 順位データ
  provisionalRank?: number; // 暫定順位（試合途中でも更新）
  // rank = 公式順位（リーグ内の全試合完了時のみ設定）
}

// 試合計画の範囲を定義するインターフェース
interface MatchPlanRange {
  start: number;
  end: number;
  additional?: number[];
}

// ベースとなるTeamDataインターフェース（共通プロパティ）
interface BaseTeamData {
  type: CompetitionType;
  matchPlanIdRange?: MatchPlanRange;
  isCompleted?: boolean; // リーグやトーナメントが完了したかどうか
}

// リーグ形式のTeamDataインターフェース
interface LeagueTeamData extends BaseTeamData {
  type: 'league';
  blocks: {
    [blockName: string]: LeagueTeamInfo[];
  };
  blockStatus?: {
    [blockName: string]: {
      completed: boolean; // ブロック内の全試合が完了したか
      totalMatches: number; // ブロック内の総試合数
      completedMatches: number; // 完了した試合数
    };
  };
}

// トーナメント形式のTeamDataインターフェース
interface TournamentTeamData extends BaseTeamData {
  type: 'tournament';
  teams: TeamInfo[];
}

// 共用体型として定義（discriminated union）
type TeamData = LeagueTeamData | TournamentTeamData;

// 既存コードとの互換性のために元のTeamInfoも維持
interface BasicTeamInfo {
  teamId: string;
  rank?: number;
}