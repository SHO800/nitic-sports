export enum Status {
    Waiting, // 待機中
    Preparing, // 準備中
    Playing, // 試合中
    Finished, // 終了 (結果入力待ち)
    Completed, // 完了
    Cancelled, // 中止 (雨等でもこれ)

}