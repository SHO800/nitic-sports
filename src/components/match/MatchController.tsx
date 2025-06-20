import {updateMatchPlanStatus} from "@/app/actions/data";
import {useDataContext} from "@/contexts/dataContext";
import {type MatchPlan, Status} from "@prisma/client";
import LoadingButton from "@/components/common/LoadingButton";

const MatchController = ({match}: { match: MatchPlan }) => {
    const {mutateMatchData} = useDataContext();

    // ステータスを更新する関数
    const updateMatchStatus = async (matchId: number, status: Status) => {
        const plusTime = Number.parseInt(process.env.NEXT_PUBLIC_PLUS_TIME ?? "0");
        const updateTime = plusTime
            ? new Date(new Date().getTime() + plusTime)
            : new Date();
        try {
            await updateMatchPlanStatus(
                matchId,
                status,
                status === Status.Playing ? updateTime : undefined,
                status === Status.Finished ? updateTime : undefined,
            );
            await mutateMatchData();
        } catch (error) {
            console.error("ステータス更新エラー:", error);
        }
    };

    // タイマーの開始（Playing状態に移行）
    const handleStartTimer = async () => {
        await updateMatchStatus(match.id, Status.Playing);
    };
    // タイマーの停止（Finished状態に移行）
    const handleStopTimer = async () => {
        await updateMatchStatus(match.id, Status.Finished);
    };

    return (
        <div className="flex mt-2 space-x-2 ">
            {match.status === Status.Preparing && (
                <LoadingButton
                    className={"bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded max-w-full w-[8em]"}
                    onClick={handleStartTimer} type={"button"} disabled={false}>
                    ▶
                </LoadingButton>
            )}
            {match.status === Status.Playing && (
                <LoadingButton
                    className={"bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded max-w-full w-[8em]"}
                    onClick={handleStopTimer} type={"button"} disabled={false}>
                    ■
                </LoadingButton>
            )}
        </div>
    );
};

export default MatchController;
