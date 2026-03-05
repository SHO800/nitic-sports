# nitic-sports 次期バージョン 要件定義・仕様策定・課題抽出ドキュメント

> **作成日**: 2026-03-05
> **対象リポジトリ**: SHO800/nitic-sports
> **目的**: 来年度版（次期バージョン）の設計・改善方針を策定するための現状分析と要件定義

---

## 目次

1. [システム概要とアーキテクチャの現状](#1-システム概要とアーキテクチャの現状)
2. [主要ディレクトリ・ファイル間の依存関係とデータフロー](#2-主要ディレクトリファイル間の依存関係とデータフロー)
3. [技術的負債と現状の課題](#3-技術的負債と現状の課題)
4. [来年度版のシステム要件と改善方針](#4-来年度版のシステム要件と改善方針)
5. [リファクタリングおよび再設計の具体案](#5-リファクタリングおよび再設計の具体案)

---

## 1. システム概要とアーキテクチャの現状

### 1.1 システム概要

nitic-sports は、学校の体育祭（球技大会）における試合の管理・閲覧を行う Web アプリケーションである。主な利用者は以下の2種類に分かれる。

| ロール | 主な機能 |
|--------|----------|
| **一般閲覧者（生徒・教員）** | 試合スケジュール確認、試合結果閲覧、リアルタイム進行状況確認、会場マップ確認 |
| **運営者（管理者）** | 試合計画の作成・編集、試合結果の入力、イベント・チーム・会場の管理、スコア管理 |

### 1.2 技術スタック

| カテゴリ | 技術 | バージョン |
|----------|------|-----------|
| フレームワーク | Next.js (App Router) | 15.4.10 |
| UI ライブラリ | React / React DOM | 19.1.0 |
| 言語 | TypeScript | 5.x |
| データベース | PostgreSQL | - |
| ORM | Prisma | 6.5.0 |
| スタイリング | Tailwind CSS | 4.x |
| UI コンポーネント | Headless UI | 2.2.1 |
| データフェッチ | SWR | 2.3.3 |
| バリデーション | Zod | 3.24.3 |
| 認証(JWT) | jose | 6.0.10 |
| コード品質 | ESLint 9 + Biome 1.9.4 | - |
| モニタリング | Vercel Analytics / Speed Insights | - |
| デプロイ | Vercel（推定） | - |

### 1.3 現行アーキテクチャの全体像

```
┌─────────────────────────────────────────────────────────┐
│                      クライアント                         │
│  ┌─────────┐  ┌─────────┐  ┌──────┐  ┌────────────────┐ │
│  │ トップ   │  │ 試合詳細 │  │ マップ │  │ ダッシュボード  │ │
│  │ page.tsx │  │ match/  │  │ map/ │  │ dashboard/     │ │
│  └────┬────┘  └────┬────┘  └──┬───┘  └───────┬────────┘ │
│       │            │          │               │          │
│  ┌────▼────────────▼──────────▼───────────────▼────────┐ │
│  │           DataContext (React Context)                │ │
│  │     ┌──────────────────────────────────────┐        │ │
│  │     │  useData() カスタムフック (SWR)        │        │ │
│  │     │  - events, matchPlans, matchResults  │        │ │
│  │     │  - teams, locations, scores          │        │ │
│  │     │  + メモ化キャッシュ (MEMO_CACHE)      │        │ │
│  │     └──────────────┬───────────────────────┘        │ │
│  └────────────────────┼────────────────────────────────┘ │
└───────────────────────┼──────────────────────────────────┘
                        │ fetch (SWR)
                        ▼
┌───────────────────────────────────────────────────────────┐
│                   Next.js サーバー                         │
│  ┌──────────────────┐  ┌───────────────────────────────┐  │
│  │    API Routes     │  │      Server Actions           │  │
│  │  GET /api/event   │  │  mutateServerData()           │  │
│  │  GET /api/team    │  │  createMatchResult()          │  │
│  │  GET /api/match-* │  │  updateMatchPlan()            │  │
│  │  GET /api/score   │  │  revalidateTag()              │  │
│  │  GET /api/location│  │                               │  │
│  └────────┬─────────┘  └──────────────┬────────────────┘  │
│           │                           │                   │
│  ┌────────▼───────────────────────────▼────────────────┐  │
│  │            lib/readQueries.ts (Prisma)              │  │
│  │       "use cache" + cacheTag + cacheLife            │  │
│  └────────────────────┬───────────────────────────────┘  │
└───────────────────────┼───────────────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   PostgreSQL     │
              │  (Prisma ORM)    │
              └──────────────────┘
```

### 1.4 データベースモデル

```
┌──────────┐     ┌────────────┐     ┌──────────────┐
│   Team   │────<│   Score    │>────│    Event     │
│ id       │     │ teamId     │     │ id           │
│ name     │     │ eventId    │     │ name         │
│ color?   │     │ score      │     │ teamData(JSON)│
└──────────┘     └────────────┘     │ isCompleted  │
                                    │ isTimeBased  │
                                    └──────┬───────┘
                                           │ 1:N
                                    ┌──────▼───────┐     ┌──────────────┐
                                    │  MatchPlan   │────>│MatchResult   │
                                    │ id           │ 1:1 │ matchPlanId  │
                                    │ teamIds[]    │     │ teamIds[]    │
                                    │ status       │     │ matchScores[]│
                                    │ startTime    │     │ winnerTeamId │
                                    │ eventId      │     │ loserTeamId  │
                                    │ locationId   │     └──────────────┘
                                    └──────┬───────┘
                                           │ N:1
                                    ┌──────▼───────┐
                                    │  Location    │
                                    │ id           │
                                    │ name         │
                                    │ coordinates  │
                                    └──────────────┘
```

**Status 列挙型**: `Waiting` → `Preparing` → `Playing` → `Finished` → `Completed` → `Cancelled`

---

## 2. 主要ディレクトリ・ファイル間の依存関係とデータフロー

### 2.1 ディレクトリ構成

```
src/
├── app/                          # Next.js App Router（ページ・API・サーバーアクション）
│   ├── page.tsx                  #   トップページ
│   ├── layout.tsx                #   ルートレイアウト（Context Provider ラップ）
│   ├── login/page.tsx            #   ログインページ
│   ├── match/page.tsx            #   試合操作ページ（管理者向け）
│   ├── map/page.tsx              #   会場マップ
│   ├── schedule/page.tsx         #   スケジュール
│   ├── dashboard/page.tsx        #   管理ダッシュボード
│   ├── actions/data.ts           #   Server Actions（データ変更操作）
│   └── api/                      #   REST API（データ取得専用）
│       ├── match-data/route.ts   #     統合データエンドポイント
│       ├── event/route.ts        #     イベント一覧
│       ├── team/route.ts         #     チーム一覧
│       ├── location/route.ts     #     会場一覧
│       ├── score/route.ts        #     スコア一覧
│       ├── match-plan/route.ts   #     試合計画一覧
│       ├── match-result/route.ts #     試合結果一覧
│       └── auth/cookie/check/    #     認証チェック
├── components/                   # React コンポーネント群
│   ├── common/                   #   共通コンポーネント（テーブル、時計、ブラケット等）
│   ├── dashboard/                #   管理画面用コンポーネント
│   ├── match/                    #   試合操作コンポーネント
│   ├── information/              #   情報表示コンポーネント
│   ├── map/                      #   マップコンポーネント
│   ├── schedule/                 #   スケジュールコンポーネント
│   ├── top/                      #   トップページ用コンポーネント
│   ├── layout/                   #   ヘッダー・フッター
│   ├── auth/                     #   認証UI（サインイン・サインアウト）
│   └── reader/                   #   読み上げ・表示用コンポーネント
├── contexts/                     # React Context
│   ├── dataContext.tsx           #   グローバルデータ Context
│   └── currentTimeContext.tsx    #   現在時刻 Context
├── hooks/                        # カスタムフック
│   ├── data.ts                   #   データフェッチ・加工ロジック（SWR + メモ化）
│   ├── currentTime.ts            #   リアルタイム時刻管理
│   └── useTournamentLine.ts      #   トーナメント線描画
├── types/                        # TypeScript 型定義
├── utils/                        # ユーティリティ関数
├── session/                      # セッション管理（暗号化・復号）
└── middleware.ts                 # Next.js ミドルウェア（認証ガード）

lib/
├── prisma.ts                     # Prisma クライアント（シングルトン）
└── readQueries.ts                # データベース読み取りクエリ（"use cache" 付き）
```

### 2.2 データフローの詳細

#### 読み取りフロー（一般閲覧者）

```
1. ブラウザ → SWR (useData フック) → fetch → /api/match-data → readQueries → PostgreSQL
2. SWR キャッシュに保存（60秒間隔で再検証）
3. DataContext 経由で全コンポーネントにデータ配信
4. 各コンポーネントで MEMO_CACHE を使用した表示文字列の計算
```

#### 書き込みフロー（管理者）

```
1. ダッシュボード/試合ページ → Server Action (actions/data.ts)
2. Prisma で DB 更新
3. revalidateTag() でサーバーキャッシュを無効化
4. クライアント側で mutate() を呼び出して SWR キャッシュを更新
```

#### 認証フロー

```
1. /login ページ → sign-in コンポーネント → Server Action (session/index.ts)
2. パスワード検証 → AES-256-CBC で暗号化 → "sess" Cookie に保存
3. /match ページアクセス時 → middleware.ts → /api/auth/cookie/check で検証
4. Cookie 復号 → username が MATCH_EDITOR_PASS と一致するか確認
```

### 2.3 コンポーネント間の依存関係

```
layout.tsx
├── CurrentTimeContextProvider
│   └── useCurrentTime() フック
├── DataContextProvider
│   ├── DataPreFetcher (Server Component → SWR Fallback)
│   └── useData() フック
│       ├── SWR: /api/match-data (60秒ポーリング)
│       ├── SWR: /api/team (長期キャッシュ)
│       ├── SWR: /api/location (長期キャッシュ)
│       └── MEMO_CACHE (30秒 TTL)
│           ├── getMatchDisplayStr()
│           ├── getActualTeamIdByVariableId()
│           └── getBlockMatchPlans()
├── Header
└── Footer

page.tsx (トップ)
├── MatchSearcher
│   └── ConditionSelector
└── Informations
    ├── NextMatch
    ├── CurrentMatches
    ├── NowHot
    └── EventSwitch

match/page.tsx
├── LocationSelector
├── MatchesByLocation
│   └── MatchCard
│       ├── MatchTimer
│       ├── MatchTeams
│       └── MatchController
│           └── matchControlButton
└── CheckMatchScoresModal

dashboard/page.tsx
├── Events (EventForm, EventEditForm, EventList)
├── Location
├── MatchPlan (AddMatchPlanForm)
│   └── MatchCard (dashboard版)
├── Teams
└── TotalScore

schedule/page.tsx
└── Schedule
    └── TimeLine

map/page.tsx
├── MapContainer
│   └── MapInfo
├── Modal
└── EventModal
```

---

## 3. 技術的負債と現状の課題

### 3.1 重大度別 課題一覧

#### 🔴 重大（セキュリティ・データ整合性に影響）

| # | 課題 | 該当ファイル | 詳細 |
|---|------|-------------|------|
| 1 | **API エンドポイントに認証なし** | `src/app/api/*/route.ts` 全 GET エンドポイント | すべての GET API が認証チェックなしで公開されている。`/api/match-data` で全データが取得可能 |
| 2 | **Server Action にエラーハンドリングなし** | `src/app/actions/data.ts` | `createMatchResult()` 以外の変更系操作（update, delete）に try-catch がない。DB エラーが未処理例外となる |
| 3 | **認証方式の脆弱性** | `src/middleware.ts`, `src/session/index.ts` | 単一パスワード（`MATCH_EDITOR_PASS`）による認証。ブルートフォース対策なし、セッション有効期限の管理なし |
| 4 | **async/await の誤用（filter 内）** | `src/utils/leagueRanking.ts` | `Array.filter()` に async コールバックを渡しており、Promise オブジェクトが truthy として評価されるため、フィルタリングが正しく機能しない |
| 5 | **型安全性の欠如（型キャスト）** | `src/hooks/data.ts`, `src/utils/tournamentUtils.ts` 他 | `event.teamData` を `unknown as TeamData[]` としてキャストしており、ランタイムバリデーションが存在しない |

#### 🟡 中程度（保守性・拡張性に影響）

| # | 課題 | 該当ファイル | 詳細 |
|---|------|-------------|------|
| 6 | **ハードコードされた日付** | `src/utils/judgeDay12.ts` | `2025-05-22`, `2025-05-23` が直接埋め込まれており、毎年コード修正が必要 |
| 7 | **マジックナンバーの多用** | `src/utils/calcEventScore.ts` | `classCount = 4`, `relatedMatchPlans.length === 5` 等の定数がハードコードされている（コメントに「応急処置」と記載） |
| 8 | **グローバル MEMO_CACHE のメモリリスク** | `src/hooks/data.ts` | グローバル `Map` でキャッシュを管理。キャッシュ無効化メカニズムが不完全で、メモリリークのリスクがある |
| 9 | **DOM 直接操作** | `src/components/dashboard/events/EventForm.tsx` | `document.getElementById()` を使用してフォーム値を取得。React の制御コンポーネントパターンに反する |
| 10 | **コメントアウトされたコード** | `src/app/map/page.tsx` | 約60行のコメントアウトコードが残存。`src/components/dashboard/MatchResult.tsx` もファイル全体がコメントアウト |
| 11 | **Context Provider 内でのフック呼び出し** | `src/contexts/dataContext.tsx` | Provider コンポーネント内で `useData()` フックを呼び出しており、クロージャの陳腐化リスクがある |
| 12 | **トーナメントブラケットの計算バグ** | `src/utils/tournamentUtils.ts` | コメントに「准々決勝とかの row の計算がうまく行っておらず」と記載。既知のバグが未修正 |
| 13 | **@ts-ignore の使用** | `src/components/top/matchSearcher/MatchSearcher.tsx` 他 | 型エラーを `@ts-ignore` で抑制しており、型安全性を損なっている |
| 14 | **useMemo の過剰な依存配列** | `src/components/common/tournamentTable/TournamentTable.tsx` | useMemo に 11 個の依存関係があり、不要な再計算が頻発するリスクがある |

#### 🟢 軽度（コード品質・可読性）

| # | 課題 | 該当ファイル | 詳細 |
|---|------|-------------|------|
| 15 | **コード重複（モーダル状態管理）** | `TournamentTable.tsx`, `LeagueTable.tsx` | モーダルの開閉ロジックが複数コンポーネントで重複 |
| 16 | **コード重複（時刻パーサー）** | `src/components/dashboard/MatchResultForm.tsx` | 時刻文字列のパース処理（`hh:mm:ss.ms`）が複数箇所で重複 |
| 17 | **コード重複（ラジオボタン）** | `src/components/dashboard/events/EventForm.tsx` | イベントタイプ選択の UI が2回繰り返されている |
| 18 | **Props ドリリング** | `TournamentTable.tsx` → `TournamentMatchBox` → `TournamentTeamBox` | 8 個以上の Props が多段階に渡って受け渡されている |
| 19 | **不統一な命名規則** | `LeagueTable.tsx` (`i_key`) 他 | snake_case と camelCase が混在している |
| 20 | **マップ座標のハードコード** | `src/app/map/page.tsx` | Tailwind のマージンクラス（`ml-29.5`, `mt-29.5` 等）で位置を直接指定しており、レスポンシブ性に欠ける |
| 21 | **エラーバウンダリの未実装** | 全ページ | Suspense フォールバックやエラーバウンダリが未設定 |
| 22 | **Linter 設定の重複** | `biome.json`, `eslint.config.mjs` | ESLint と Biome が併用されており、ルールの重複・矛盾のリスクがある |

### 3.2 アンチパターンの詳細分析

#### 3.2.1 グローバルメモ化キャッシュ（`MEMO_CACHE`）

**ファイル**: `src/hooks/data.ts`

データフェッチ用カスタムフック内にグローバルな `Map` オブジェクトを作成し、30秒 TTL で表示文字列や計算結果をキャッシュしている。

**問題点**:
- React のライフサイクル外でグローバルに状態を保持しており、Server Side Rendering 時に複数リクエスト間でキャッシュが共有される可能性がある
- キャッシュのサイズ制限がなく、エントリが増え続ける
- SWR のキャッシュと役割が重複している

#### 3.2.2 変数チーム ID（Variable Team ID）の文字列パース

**ファイル**: `src/utils/analyzeVariableTeamId.ts`, `src/hooks/data.ts`

MatchPlan の `teamIds` フィールドに格納される値の例:
- `$T-5-W`: トーナメント形式で matchPlanId=5 の勝者チーム
- `$L-3-0-A-1`: リーグ形式で eventId=3, index=0, blockName=A, expectedRank=1 のチーム

**問題点**:
- 文字列ベースの参照関係であり、データベースの外部キー制約で整合性を保証できない
- パース処理が複数ファイルに分散している
- 正規表現やバリデーションが不完全で、不正な形式への耐性が低い

#### 3.2.3 肥大化したカスタムフック（`useData`）

**ファイル**: `src/hooks/data.ts`

このフックは以下の責務をすべて1つのフック内で担っている:
- 6 種類のデータの SWR フェッチ
- メモ化キャッシュの管理
- チーム名表示文字列の生成
- 変数チーム ID の実体解決
- ブロック別試合計画の抽出
- エラー状態の集約

**単一責任原則に違反**しており、テストが困難で変更の影響範囲が大きい。

---

## 4. 来年度版のシステム要件と改善方針

### 4.1 機能要件

#### 既存機能の継続

| 機能 | 説明 | 改善ポイント |
|------|------|-------------|
| 試合スケジュール表示 | リーグ・トーナメント形式の試合一覧 | リアルタイム更新の改善 |
| 試合結果入力・表示 | 管理者による結果入力と一般向け結果表示 | バリデーション強化 |
| 会場マップ | 校内マップと会場位置の表示 | レスポンシブ対応 |
| ダッシュボード | イベント・チーム・会場・スコアの管理 | UI/UX の改善 |
| 認証 | 管理者向けログイン機能 | セキュリティ強化 |

#### 新規・改善要件

| # | 要件 | 優先度 | 理由 |
|---|------|--------|------|
| F-01 | **設定の外部化**: 大会日程・クラス数等の設定を DB または config ファイルで管理 | 高 | 毎年のコード変更を不要にする |
| F-02 | **リアルタイム更新**: WebSocket または Server-Sent Events による即時データ反映 | 高 | 現状の 60 秒ポーリングでは体験が劣る |
| F-03 | **ロールベースアクセス制御（RBAC）**: 管理者・審判・閲覧者の権限分離 | 高 | セキュリティと運用性の改善 |
| F-04 | **入力バリデーション強化**: Zod スキーマによるフォーム・API の一貫したバリデーション | 中 | データ整合性の確保 |
| F-05 | **エラーハンドリングの統一**: エラーバウンダリとトースト通知の導入 | 中 | ユーザー体験の改善 |
| F-06 | **監査ログ**: データ変更操作の履歴記録 | 中 | トラブルシューティングと運用管理 |
| F-07 | **PWA 対応**: オフラインキャッシュとプッシュ通知 | 低 | 体育祭当日の通信環境対策 |
| F-08 | **多言語対応（i18n）** | 低 | 留学生への対応 |

### 4.2 非機能要件

| # | 要件 | 目標値 | 現状 |
|---|------|--------|------|
| NF-01 | **レスポンス時間** | ページ読み込み 2 秒以内 | 未計測（SWR キャッシュで部分的に対応） |
| NF-02 | **同時接続数** | 500 以上 | 未検証 |
| NF-03 | **テストカバレッジ** | 80% 以上 | 0%（テストコードが存在しない） |
| NF-04 | **アクセシビリティ** | WCAG 2.1 AA 準拠 | 部分的（Headless UI 使用部分のみ） |
| NF-05 | **セキュリティ** | OWASP Top 10 対策 | 不十分（認証・認可の課題あり） |
| NF-06 | **保守性** | 新規メンバーが 1 日で開発環境構築・理解可能 | ドキュメント不足 |

### 4.3 改善方針

```
方針1: 関心事の分離と単一責任の徹底
  → フック・コンポーネントの肥大化を解消し、テスタブルな構造へ

方針2: 型安全性の強化
  → ランタイムバリデーション（Zod）と TypeScript 型の一貫した連携

方針3: セキュリティの強化
  → 認証・認可の再設計、API 保護、入力バリデーション

方針4: 設定の外部化
  → ハードコードされた日付・定数の排除

方針5: テスト基盤の構築
  → ユニットテスト・統合テスト・E2E テストの導入

方針6: 開発者体験（DX）の改善
  → ドキュメント整備、リンター統一、型定義の充実
```

---

## 5. リファクタリングおよび再設計の具体案

### 5.1 新しいディレクトリ構造案

**方針**: Feature-based（機能別）構造への移行により、関連するコード群を凝集させる。

```
src/
├── app/                              # Next.js App Router（ルーティングのみ）
│   ├── (public)/                     #   公開ページグループ
│   │   ├── page.tsx                  #     トップページ
│   │   ├── schedule/page.tsx         #     スケジュール
│   │   └── map/page.tsx              #     マップ
│   ├── (admin)/                      #   管理者ページグループ（認証必須）
│   │   ├── layout.tsx                #     認証チェック付きレイアウト
│   │   ├── dashboard/page.tsx        #     ダッシュボード
│   │   └── match/page.tsx            #     試合操作
│   ├── (auth)/                       #   認証ページグループ
│   │   └── login/page.tsx            #     ログイン
│   ├── api/                          #   API Routes
│   │   └── v1/                       #     バージョニング付き API
│   │       ├── events/route.ts
│   │       ├── matches/route.ts
│   │       ├── teams/route.ts
│   │       ├── locations/route.ts
│   │       └── scores/route.ts
│   ├── layout.tsx
│   ├── error.tsx                     #   グローバルエラーバウンダリ
│   ├── loading.tsx                   #   グローバルローディング
│   └── not-found.tsx                 #   404 ページ
│
├── features/                         # ★ 機能別モジュール（新設）
│   ├── event/
│   │   ├── components/               #   イベント関連 UI コンポーネント
│   │   │   ├── EventForm.tsx
│   │   │   ├── EventList.tsx
│   │   │   └── EventCard.tsx
│   │   ├── hooks/                    #   イベント専用フック
│   │   │   └── useEvents.ts
│   │   ├── actions/                  #   イベント関連 Server Actions
│   │   │   └── event-actions.ts
│   │   ├── types.ts                  #   イベント関連型定義
│   │   └── utils.ts                  #   イベント関連ユーティリティ
│   │
│   ├── match/
│   │   ├── components/
│   │   │   ├── MatchCard.tsx
│   │   │   ├── MatchController.tsx
│   │   │   ├── MatchResultForm.tsx
│   │   │   ├── MatchTimer.tsx
│   │   │   └── MatchScoreModal.tsx
│   │   ├── hooks/
│   │   │   ├── useMatches.ts
│   │   │   └── useMatchTimer.ts
│   │   ├── actions/
│   │   │   └── match-actions.ts
│   │   ├── types.ts
│   │   └── utils/
│   │       ├── time-format.ts        #   時刻パース・フォーマット
│   │       └── variable-team-id.ts   #   変数チーム ID 解決
│   │
│   ├── tournament/
│   │   ├── components/
│   │   │   ├── TournamentBracket.tsx
│   │   │   ├── TournamentMatchBox.tsx
│   │   │   └── TournamentTeamBox.tsx
│   │   ├── hooks/
│   │   │   └── useTournament.ts
│   │   ├── types.ts
│   │   └── utils/
│   │       └── bracket-builder.ts    #   ブラケット構築ロジック
│   │
│   ├── league/
│   │   ├── components/
│   │   │   ├── LeagueTable.tsx
│   │   │   ├── LeagueTableRow.tsx
│   │   │   └── LeagueTableCell.tsx
│   │   ├── hooks/
│   │   │   └── useLeague.ts
│   │   ├── types.ts
│   │   └── utils/
│   │       └── ranking.ts           #   リーグ順位計算
│   │
│   ├── schedule/
│   │   ├── components/
│   │   │   ├── Schedule.tsx
│   │   │   └── TimeLine.tsx
│   │   └── hooks/
│   │       └── useSchedule.ts
│   │
│   ├── map/
│   │   ├── components/
│   │   │   ├── CampusMap.tsx
│   │   │   ├── MapPin.tsx
│   │   │   └── MapModal.tsx
│   │   ├── hooks/
│   │   │   └── useMap.ts
│   │   └── constants.ts             #   マップ座標定数
│   │
│   └── auth/
│       ├── components/
│       │   ├── SignInForm.tsx
│       │   └── SignOutButton.tsx
│       ├── actions/
│       │   └── auth-actions.ts
│       ├── middleware.ts
│       └── session.ts
│
├── shared/                           # ★ 共通モジュール（新設）
│   ├── components/
│   │   ├── ui/                       #   汎用 UI コンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Toast.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── hooks/
│   │   ├── useCurrentTime.ts
│   │   └── useModal.ts              #   モーダル状態管理の統一
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── fetcher.ts
│   │   └── cache.ts                 #   キャッシュユーティリティの統一
│   ├── types/
│   │   ├── database.ts              #   Prisma 型の re-export
│   │   └── common.ts
│   └── utils/
│       ├── date.ts                   #   日付ユーティリティ（外部化された設定を参照）
│       └── format.ts
│
├── config/                           # ★ 設定（新設）
│   ├── tournament.ts                 #   大会設定（日程、クラス数等）
│   ├── constants.ts                  #   グローバル定数
│   └── validation.ts                 #   Zod スキーマ定義
│
└── middleware.ts                     # Next.js ミドルウェア（認証ガードのみ）
```

### 5.2 具体的なリファクタリング案

#### 5.2.1 データフェッチングの再設計

**現状**: 1つの巨大な `useData()` フックが全データを管理

**改善案**: 機能別フックへ分割 + React Server Components の活用

```typescript
// 【Before】 src/hooks/data.ts - 1つのフックに全責務
export function useData() {
  const { data: matchData } = useSWR("/api/match-data", fetcher, { ... });
  const { data: teams } = useSWR("/api/team", fetcher, { ... });
  // ... 6種類のデータフェッチ + 加工ロジック + キャッシュ
  return { events, matchPlans, matchResults, teams, locations, scores, ... };
}

// 【After】 機能別フックに分割
// features/match/hooks/useMatches.ts
export function useMatches() {
  const { data, error, mutate } = useSWR<MatchPlan[]>("/api/v1/matches", fetcher);
  return { matches: data, isLoading: !data && !error, error, refresh: mutate };
}

// features/event/hooks/useEvents.ts
export function useEvents() {
  const { data, error, mutate } = useSWR<Event[]>("/api/v1/events", fetcher);
  return { events: data, isLoading: !data && !error, error, refresh: mutate };
}

// shared/hooks/useTeams.ts （複数機能で共有されるデータ）
export function useTeams() {
  const { data } = useSWR<Team[]>("/api/v1/teams", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5分
  });
  return { teams: data ?? [], teamMap: new Map(data?.map(t => [t.id, t])) };
}
```

#### 5.2.2 設定の外部化

**現状**: 日付やクラス数がコード内にハードコードされている

**改善案**: 設定ファイルまたは DB テーブルで管理

```typescript
// 【Before】 src/utils/judgeDay12.ts
const day1 = new Date("2025-05-22");
const day2 = new Date("2025-05-23");

// 【Before】 src/utils/calcEventScore.ts
const classCount = 4;

// 【After】 config/tournament.ts
export const tournamentConfig = {
  year: 2026,
  name: "球技大会 2026",
  days: [
    { date: "2026-05-21", label: "1日目" },
    { date: "2026-05-22", label: "2日目" },
  ],
  classCount: 4,
  // 将来的にはDBから取得
} as const;

// 【After】 config/validation.ts
import { z } from "zod";

export const tournamentConfigSchema = z.object({
  year: z.number(),
  name: z.string(),
  days: z.array(z.object({
    date: z.string().date(),
    label: z.string(),
  })),
  classCount: z.number().positive(),
});
```

#### 5.2.3 認証・認可の再設計

**現状**: 単一パスワード + Cookie 暗号化

**改善案**: ロールベースアクセス制御（RBAC）の導入

```typescript
// 【After】 Prisma スキーマへの追加
// model User {
//   id        Int      @id @default(autoincrement())
//   username  String   @unique
//   password  String   // bcrypt ハッシュ
//   role      Role     @default(Viewer)
//   createdAt DateTime @default(now())
// }
//
// enum Role {
//   Admin    // 全機能
//   Referee  // 試合操作・結果入力
//   Viewer   // 閲覧のみ
// }

// 【After】 API ミドルウェアでの認可チェック
// features/auth/middleware.ts
// export async function requireRole(requiredRole: Role) {
//   const session = await getSession();
//   if (!session || !hasPermission(session.role, requiredRole)) {
//     throw new AuthorizationError("Insufficient permissions");
//   }
// }
```

#### 5.2.4 API エラーハンドリングの統一

**現状**: エラーハンドリングが散在、あるいは未実装

**改善案**: 統一されたエラーレスポンス形式

```typescript
// 【After】 shared/lib/api-response.ts
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export function apiSuccess<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data });
}

export function apiError(
  code: string,
  message: string,
  status: number
): NextResponse {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}

// 【After】 API Route での使用例
// app/api/v1/events/route.ts
export async function GET() {
  try {
    const events = await getAllEvents();
    return apiSuccess(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return apiError("FETCH_FAILED", "イベントの取得に失敗しました", 500);
  }
}
```

#### 5.2.5 テスト基盤の導入

**現状**: テストコードが一切存在しない

**改善案**: 段階的なテスト導入

```
テスト戦略:
├── ユニットテスト (Vitest)
│   ├── utils/ - ピュア関数のテスト（tournamentUtils, leagueRanking, calcEventScore）
│   ├── hooks/ - カスタムフックのテスト（@testing-library/react-hooks）
│   └── components/ - コンポーネントのスナップショットテスト
│
├── 統合テスト (Vitest + Testing Library)
│   ├── API Routes - リクエスト/レスポンスの検証
│   └── Server Actions - DB操作の検証
│
└── E2E テスト (Playwright)
    ├── 試合結果入力フロー
    ├── ダッシュボード操作
    └── 閲覧者向けページ表示
```

### 5.3 移行ロードマップ

```
Phase 1: 基盤整備（1-2週間）
├── [ ] テスト環境の構築（Vitest + Playwright）
├── [ ] config/ ディレクトリの作成とハードコード値の外部化
├── [ ] ESLint または Biome の統一（一方を廃止）
├── [ ] エラーバウンダリ・ローディング状態の追加
└── [ ] 既知バグの修正（leagueRanking の async/filter、tournamentUtils の行計算）

Phase 2: セキュリティ強化（1-2週間）
├── [ ] 認証・認可の再設計（RBAC導入）
├── [ ] API エンドポイントへの認証ミドルウェア追加
├── [ ] Server Action のエラーハンドリング追加
├── [ ] 入力バリデーション（Zod スキーマ）の整備
└── [ ] セッション管理の改善（有効期限、ログアウト処理）

Phase 3: アーキテクチャ改善（2-3週間）
├── [ ] features/ ディレクトリ構造への段階的移行
├── [ ] useData() フックの分割
├── [ ] MEMO_CACHE の廃止と SWR ネイティブキャッシュへの統一
├── [ ] DOM 直接操作の排除（制御コンポーネント化）
├── [ ] @ts-ignore の解消と型安全性の強化
└── [ ] コンポーネントの Props 整理（Context 化 vs Props）

Phase 4: 新機能開発（2-3週間）
├── [ ] リアルタイム更新（SSE/WebSocket）の導入
├── [ ] PWA 対応
├── [ ] アクセシビリティ改善
└── [ ] パフォーマンス最適化（Server Components 活用）

Phase 5: 品質保証（1-2週間）
├── [ ] ユニットテスト追加（カバレッジ 80%）
├── [ ] E2E テストシナリオ作成
├── [ ] パフォーマンステスト
└── [ ] セキュリティ監査
```

### 5.4 優先度マトリクス

```
          高い影響度
              │
   Phase 2    │   Phase 1
  セキュリティ │   基盤整備
   強化       │
              │
低い緊急度 ───┼─── 高い緊急度
              │
   Phase 4    │   Phase 3
   新機能     │   アーキテクチャ
              │   改善
              │
          低い影響度
```

---

## 付録: 現行ファイル対応表（主要ファイル）

| 現行パス | 新パス（提案） | 変更理由 |
|----------|---------------|----------|
| `src/hooks/data.ts` | `features/*/hooks/use*.ts` | 単一責任原則、機能別分割 |
| `src/contexts/dataContext.tsx` | `shared/providers/DataProvider.tsx` | Context の責務明確化 |
| `src/utils/judgeDay12.ts` | `config/tournament.ts` | 設定の外部化 |
| `src/utils/calcEventScore.ts` | `features/event/utils/score.ts` | 機能別配置 |
| `src/utils/tournamentUtils.ts` | `features/tournament/utils/bracket-builder.ts` | 機能別配置 |
| `src/utils/leagueRanking.ts` | `features/league/utils/ranking.ts` | 機能別配置 |
| `src/utils/analyzeVariableTeamId.ts` | `features/match/utils/variable-team-id.ts` | 機能別配置 |
| `src/session/` | `features/auth/session.ts` | 認証機能に統合 |
| `src/components/common/tournamentTable/` | `features/tournament/components/` | 機能別配置 |
| `src/components/common/leagueTable/` | `features/league/components/` | 機能別配置 |
| `src/components/dashboard/events/` | `features/event/components/` | 機能別配置 |
| `src/components/match/` | `features/match/components/` | 機能別配置 |
| `lib/readQueries.ts` | `shared/lib/queries.ts` | 共通ライブラリに統合 |
