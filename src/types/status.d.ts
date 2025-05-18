export enum Status {
	Waiting = 0, // 待機中
	Preparing = 1, // 準備中
	Playing = 2, // 試合中
	Finished = 3, // 終了 (結果入力待ち)
	Completed = 4, // 完了
	Cancelled = 5, // 中止 (雨等でもこれ)
}
