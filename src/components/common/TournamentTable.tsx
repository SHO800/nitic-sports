import {MatchPlan} from "@prisma/client";
import analyzeVariableTeamId from "@/utils/analyzeVariableTeamId";
import {useData} from "@/hooks/data";
import Tournament from "@/components/common/Tournament";

interface Props {
    teams: {
        teamId: string;
        rank?: number;
    }[];
    matchPlans: MatchPlan[],
}


const TournamentTable = ({teams, matchPlans}: Props) => {
    const {getMatchDisplayStr} = useData()
    //
    
    const allMatchPlanIds = matchPlans.map((matchPlan) => matchPlan.id.toString());

    /**
     * トーナメントの試合を分類するためのユーティリティ関数
     */

    /**
     * 特定の試合が別の試合の結果に依存しているか確認する
     * @param teamId チームID
     * @param matchPlans 全試合計画リスト
     * @returns 依存している場合はtrue、そうでなければfalse
     */
    function isDependentOnAnotherMatch(teamId: string, matchPlans: MatchPlan[]) {
        const variableTeamIdData = analyzeVariableTeamId(teamId);

        // 通常のチームID（非変数）または T 以外のタイプの場合は依存関係なし
        if (!variableTeamIdData || variableTeamIdData.type !== "T") {
            return false;
        }

        // このチームIDが参照している試合が存在するか確認
        const matchId = variableTeamIdData.matchId;
        return matchPlans.some(plan => plan.id === matchId);
    }

// 部分的初戦の試合（少なくとも1つのチームが他の試合に依存していない）
    const partialFirstRoundMatches = matchPlans.filter(matchPlan =>
        matchPlan.teamIds.some(teamId => !isDependentOnAnotherMatch(teamId, matchPlans))
    );

// 完全初戦の試合（すべてのチームが他の試合に依存していない）
    const completeFirstRoundMatches = matchPlans.filter(matchPlan =>
        matchPlan.teamIds.every(teamId => !isDependentOnAnotherMatch(teamId, matchPlans))
    );

// 非初戦の試合（部分的初戦だが完全初戦ではない）
    const nonFirstRoundMatches = partialFirstRoundMatches.filter(
        plan => !completeFirstRoundMatches.includes(plan)
    );

// 各カテゴリの試合に関連するチームIDを取得
    const partialFirstRoundTeamIds = partialFirstRoundMatches.flatMap(matchPlan =>
        matchPlan.teamIds
            .filter(id => !isDependentOnAnotherMatch(id, matchPlans))
            .map(id => getMatchDisplayStr(id))
    );

    const completeFirstRoundTeamIds = completeFirstRoundMatches.flatMap(matchPlan =>
        matchPlan.teamIds.map(id => getMatchDisplayStr(id))
    );

    const nonFirstRoundTeamIds = nonFirstRoundMatches.flatMap(matchPlan =>
        matchPlan.teamIds.map(id => getMatchDisplayStr(id))
    );
    //
    // console.log("部分的初戦の試合", partialFirstRoundMatches);
    // console.log("部分的初戦の試合のチームID", partialFirstRoundTeamIds);
    // console.log("完全初戦の試合", completeFirstRoundMatches);
    // console.log("完全初戦の試合のチームID", completeFirstRoundTeamIds);
    // console.log("非初戦の試合", nonFirstRoundMatches);
    // console.log("非初戦の試合のチームID", nonFirstRoundTeamIds);


    return (
        <div>
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <Tournament eventId={1} matchPlans={matchPlans}/>
                </div>
            </div>
        </div>
    );
}

export default TournamentTable;