# 貧血（鉄欠乏）早期検出・縦断研究アプリ 設計書

本設計書は、大学女子長距離選手を対象とした、貧血指標の早期検出およびベイズ階層モデル等を用いた事後統計解析に耐えうるデータ基盤の定義を行います。

## 1. データモデル (Tables)

研究利用および欠測への対応（Longitudinal Data Analysis）を考慮し、リレーショナルな正規化を行い、`Athlete`（個体）と `Timepoint`（時系列イベント）を軸に設計します。

### 1-1. Users (Athletes)
基本属性。個人内変動のベースラインとなる静的情報。

| Field Name | Type | Description | Unit/Format | Note |
| :--- | :--- | :--- | :--- | :--- |
| `user_id` | UUID | 選手一意識別子 | - | Primary Key |
| `birth_date` | Date | 生年月日 | YYYY-MM-DD | 年齢算出用 |
| `history_anemia` | Boolean | 貧血既往歴 | true/false | ベースライン共変量 |
| `baseline_ferritin` | Float | シーズン開始時/入部時フェリチン | ng/mL | 参考値 |

### 1-2. BloodTests (Periodic Medical Data)
不定期に測定される血液検査データ。もっとも重要な従属変数群です。

| Field Name | Type | Description | Unit/Format | Note |
| :--- | :--- | :--- | :--- | :--- |
| `test_id` | UUID | 検査ID | - | PK |
| `user_id` | UUID | 選手ID | - | FK |
| `date` | Date | 採血日 | YYYY-MM-DD | 時間変数 $t$ |
| `hemoglobin` (Hb) | Float | ヘモグロビン濃度 | g/dL | 貧血診断基準 |
| `ferritin` | Float | 貯蔵鉄（フェリチン）| ng/mL | 潜在性鉄欠乏指標 |
| `serum_iron` (Fe) | Float | 血清鉄 | μg/dL | |
| `tibc` | Float | 総鉄結合能 | μg/dL | |
| `rbc` | Float | 赤血球数 | 10^4/μL | |
| `hematocrit` | Float | ヘマトクリット値 | % | |
| `cpk` | Integer | クレアチンキナーゼ | U/L | 筋肉疲労・溶血の影響確認 |

### 1-3. DailyConditions (Daily Longitudinal Data)
毎日測定される自覚症状・生理状態。欠測があっても時系列解析に使用可能。

| Field Name | Type | Description | Unit/Format | Note |
| :--- | :--- | :--- | :--- | :--- |
| `log_id` | UUID | ログID | - | PK |
| `user_id` | UUID | 選手ID | - | FK |
| `date` | Date | 記録日 | YYYY-MM-DD | |
| `menses_status` | Enum | 月経状態 | 0:なし, 1:あり, 2:不正出血 | 月経周期の補正用 |
| `resting_hr` | Integer | 安静時心拍数 | bpm | 自律神経疲労指標 |
| `sleep_quality` | Integer | 睡眠の質 | 1-5 (Likert) | 1:悪い - 5:良い |
| `subjective_fatigue` | Integer | 主観的疲労度 | 0-100 (VAS) | |
| `morning_weight` | Float | 起床時体重 | kg | 除脂肪体重減少の監視 |

### 1-4. TrainingLoad (Daily Covariates)
練習による負荷（鉄需要の増大要因）。

| Field Name | Type | Description | Unit/Format | Note |
| :--- | :--- | :--- | :--- | :--- |
| `load_id` | UUID | 負荷ID | - | PK |
| `user_id` | UUID | 選手ID | - | FK |
| `date` | Date | 実施日 | YYYY-MM-DD | |
| `total_dist` | Float | 総走行距離 | km | 溶血（着地衝撃）の代理指標 |
| `trimp` | Float | TRIMP (Training Impulse) | Arbitrary Unit | 内部負荷（心拍数ベース） |
| `rpe_session` | Integer | 自覚的運動強度 | 6-20 (Borg) | |

---

## 2. 入力 UI (User Interface)

### 2-1. 選手用 (Mobile/PWA)
日常的な負荷なく、継続率を高めるUIを設計します。

*   **コンディショニング画面 (`/condition`)**:
    *   **日付選択**: デフォルトは「今日」。過去入力も編集可。
    *   **月経入力**: トグルスイッチ or ラジオボタン（出血あり/なし）。
    *   **スライダー入力**:
        *   睡眠の質 (1〜5)
        *   主観的疲労 (0〜100)
    *   **数値入力**:
        *   安静時心拍数
        *   体重
    *   *UX工夫*: 前日からの変化を矢印アイコンで表示し、入力モチベーションを維持。

*   **食事・鉄分チェック画面 (簡易版)**:
    *   「ヘム鉄（赤身肉・魚）を食べましたか？」(Yes/No/量)
    *   「ビタミンC（果物・野菜）を摂りましたか？」(Yes/No)
    *   サプリメント摂取確認。

### 2-2. スタッフ・研究者用 (Desktop/Tablet)
大量データの入力と、アラート検知を目的とします。

*   **血液検査データ一括入力 (`/admin/blood-test`)**:
    *   Excel/CSVからのインポート機能。
    *   UI上のテーブルエディタ（SpreadsheetライクなUI）で手入力も可能。
    *   基準値（例: Ferritin < 30 ng/mL）を下回るセルを赤色ハイライト。

*   **ダッシュボード (`/admin/dashboard`)**:
    *   **アラート一覧**: 推定フェリチン値が閾値を下回った選手をリストアップ。
    *   **時系列チャート**:
        *   X軸: 日付 (Month)
        *   Y1軸: Ferritin (散布図 + 補間線)
        *   Y2軸: 月間走行距離 (棒グラフ)
        *   イベントマーカー: 月経期間を帯で表示。

---

## 3. 自動計算項目 (Derived Variables)

入力データから、分析・フィードバック用に自動導出する指標です。

1.  **月経周期フェーズ (Menstrual Phase)**
    *   直近の月経開始日からの経過日数 ($Day$)。
    *   カテゴリー化: 卵胞期 (Day 1-13), 排卵期 (Day 14), 黄体期 (Day 15-28) ※個人差補正あり。

2.  **鉄欠乏リスクスコア (Iron Deficiency Risk Score)**
    *   数式モデル（例）:
        $$ Risk = w_1 \cdot (\text{Ferritin Trend}) + w_2 \cdot (\text{High Impact Distance}) - w_3 \cdot (\text{Iron Intake}) $$
    *   フェリチンの傾きが負、かつ走行距離が増加傾向にある場合にスコア上昇。

3.  **推定消費エネルギー・鉄需要**
    *   走行距離 × 体重 + 基礎代謝 から、その日必要な鉄分推奨量を動的に提示。

4.  **7日間移動平均 (7-day MA)**
    *   安静時心拍数、主観的疲労度のノイズを除去し、トレンド（オーバートレーニング兆候）を可視化。

---

## 4. CSV エクスポート構造

R (`brms`, `rstan`) や Python (`PyMC`) での解析を前提とした **Long Format (Tidy Data)** を出力仕様とします。

### 出力ファイル命名規則
`ekiden_study_export_{YYYYMMDD}.csv`

### カラム定義

| Column Name | Description | Value Example | Note |
| :--- | :--- | :--- | :--- |
| `athlete_id` | 階層モデルのGroup ID | "A001" | ランダム切片用 |
| `date` | 時系列インデックス | "2024-12-24" | |
| `days_from_baseline` | 観察開始日からの経過日数 | 120 | 連続時間変数 $t$ |
| `hb` | ヘモグロビン値 | 12.5 or `NA` | 測定日以外は `NA` (欠測) |
| `ferritin` | フェリチン値 | 25.0 or `NA` | 測定日以外は `NA` (欠測) |
| `is_blood_test_day` | 血液検査日フラグ | 1 or 0 | |
| `daily_dist_km` | 走行距離 | 16.5 | 共変量 (Time-varying) |
| `monthly_cum_dist` | 過去30日累積距離 | 450.0 | 蓄積負荷の影響評価用 |
| `menses_active` | 月経中フラグ | 1 or 0 | バイナリ |
| `menses_phase` | 月経周期区分 | "Luteal" | カテゴリカル |
| `rpe` | 自覚的強度 | 14 | |
| `sleeping_hr` | 安静時心拍 | 48 | |

### 特記事項（統計解析への配慮）
1.  **Missing Values**: 欠測セルは空白または `NA` とし、"0" で埋めないこと。（ベイズモデルでのimputationまたは欠測のままのモデリングに対応するため）
2.  **Date Consistency**: 血液検査がない日でも、トレーニング記録や体調記録が存在する日付は行として出力する（Full Join）。これにより、血液データ欠測時の「日々の負荷共変量」を利用した補間が可能になります。
