import {MatchPlan, Status} from "@prisma/client";
import {updateMatchPlanStatus} from "@/app/actions/data";
import {useData} from "@/hooks/data";
import {useDataContext} from "@/contexts/dataContext";

const MatchController = ({match}: { match: MatchPlan }) => {

    const {mutateMatchPlans,} = useDataContext()

    // ステータスを更新する関数
    const updateMatchStatus = async (matchId: number, status: Status) => {
        const plusTime = parseInt(process.env.NEXT_PUBLIC_PLUS_TIME ?? "0");
        const updateTime = plusTime ? new Date(new Date().getTime() + plusTime) : new Date();
        try {
            await updateMatchPlanStatus(
                matchId,
                status,
                status === Status.Playing ? updateTime : undefined,
                status === Status.Finished ? updateTime : undefined
            )
            await mutateMatchPlans();

        } catch (error) {
            console.error("ステータス更新エラー:", error);
        }
    }


    // タイマーの開始（Playing状態に移行）
    const handleStartTimer = () => {
        updateMatchStatus(match.id, Status.Playing);
    };
    // タイマーの停止（Finished状態に移行）
    const handleStopTimer = () => {
        updateMatchStatus(match.id, Status.Finished);
    };


    return (
        <div className="flex mt-2 space-x-2 ">
            {match.status === Status.Preparing && (
                <button
                    onClick={handleStartTimer}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded max-w-full w-[8em]"
                >
                    ▶
                </button>
            )}
            {match.status === Status.Playing && (
                <button
                    onClick={handleStopTimer}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded max-w-full w-[8em]"
                >
                    ■
                </button>
            )}
        </div>
    )

}

export default MatchController;