"use client"
import EventList from "@/components/dashboard/events/EventList";
import EventForm from "@/components/dashboard/events/EventForm";
import EventEditForm from "@/components/dashboard/events/EventEditForm";
import MinPlanIdInput from "@/components/dashboard/events/MinPlanIdInput";

/**
 * Eventsコンポーネント
 * 
 * イベント一覧、イベント追加フォーム、イベント編集フォームを表示するコンポーネント
 * 各機能は分割されたコンポーネントに移動されています
 * 
 * 例 予選はリーグ, 本選はトーナメントの場合
 * [
 *   {
 *     "type": "league",
 *     "blocks": {
 *       "A": [
 *         { "teamId": 1 },
 *         { "teamId": 2 }
 *        ],
 *       "B": [
 *         { "teamId": 3 },
 *         { "teamId": 4 }
 *        ]
 *     }
 *   },
 *  {
 *     "type": "tournament",
 *     "teams": [
 *       {"teamId": 1 },
 *       {"teamId": 3 },
 *       {"teamId": 2 },
 *   ]
 * ]
 * 最終的な順位はこの配列の-1番目のオブジェクトの値を参照する
 * 予選本選の区別がない場合は1つのオブジェクトを持つ配列を保持する
 * 例　トーナメントのみ
 * [
 *   {
 *     "type": "tournament",
 *     "teams": [
 *       {"teamId": 1 },
 *       {"teamId": 3 },
 *       {"teamId": 2 },
 *     ]
 *   }
 * ]
 */
const Events = () => {
    return (
        <>
            <EventList />
            <EventForm />
            <EventEditForm />
            <MinPlanIdInput />
        </>
    );
};

export default Events;