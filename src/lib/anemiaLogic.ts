
import { Athlete, BloodLab, DailyLog, NutritionReview, TreadmillTest, AnalysisDataRow } from '@/types/anemia';
import { subDays, isWithinInterval, parseISO, max } from 'date-fns';

/**
 * 自動計算関連の型定義
 */
export interface CalculatedMetrics {
    hr_drift?: number;
    session_rpe_load?: number;
    rolling_avg_28d_dist?: number;
    rolling_avg_28d_rpe?: number;
    rolling_median_8w_dist?: number; // 8週中央値

    // 乖離値 (Deviation from individual baseline)
    deviation_from_28d_dist?: number;
    deviation_from_28d_rpe?: number;
}

/**
 * 配列の中央値を計算するヘルパー
 */
function calculateMedian(values: number[]): number | null {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * 個人内基準値（移動平均・中央値）の計算
 * 欠測があっても停止せず、可能な範囲で計算する
 */
export function calculateRollingMetrics(
    currentDate: string,
    dailyLogs: DailyLog[] // 全期間のログ
): CalculatedMetrics {
    const targetDateObj = parseISO(currentDate);
    const startDay28 = subDays(targetDateObj, 28);
    const startDay8w = subDays(targetDateObj, 56); // 8 weeks = 56 days

    // 1. 直近28日間のデータ抽出
    const logsIn28d = dailyLogs.filter(log =>
        isWithinInterval(parseISO(log.date), { start: startDay28, end: targetDateObj })
    );

    // 2. 直近8週間のデータ抽出
    const logsIn8w = dailyLogs.filter(log =>
        isWithinInterval(parseISO(log.date), { start: startDay8w, end: targetDateObj })
    );

    // 3. トレーニング負荷（Daily）
    const currentLog = dailyLogs.find(l => l.date === currentDate);
    const session_rpe_load = currentLog
        ? currentLog.training_duration_min * currentLog.rpe
        : undefined;

    // 4. トレッドミル HR Drift は TreadmillTest から計算されるため、ここではDailyLogベースの計算を行う

    // 計算: 28日平均 (Training Distance & RPE)
    // 欠測(ログ欠落)は0として扱うか、除外するか。要件「欠測があっても計算停止しない」
    // トレーニング距離は入力なし=0kmとみなすのが自然。RPEは平均の計算対象外。
    const distValues28d = logsIn28d.map(l => l.training_distance_km);
    const totalDist28d = distValues28d.reduce((a, b) => a + b, 0);
    const rolling_avg_28d_dist = distValues28d.length > 0 ? (totalDist28d / 28) : 0; // 期間平均なので分母は28固定

    const rpeValues28d = logsIn28d.map(l => l.rpe).filter(r => r > 0);
    const totalRpe28d = rpeValues28d.reduce((a, b) => a + b, 0);
    const rolling_avg_28d_rpe = rpeValues28d.length > 0 ? (totalRpe28d / rpeValues28d.length) : undefined;

    // 計算: 8週中央値 (Training Distance)
    // 0も含む
    const distValues8w = logsIn8w.map(l => l.training_distance_km);
    // 足りない日数分 0 を埋めるべきか？ -> 一旦「記録された日」の中央値とするか、「全期間」とするか。
    // 個人内基準としては「実施した日」の強度を見たい場合と「総負荷」を見たい場合があるが、
    // ここでは「記録された値」の分布を見る。
    const rolling_median_8w_dist = calculateMedian(distValues8w);

    // 乖離値 (Deviation)
    // Current - Baseline
    const deviation_from_28d_dist = currentLog ? (currentLog.training_distance_km - rolling_avg_28d_dist) : undefined;
    const deviation_from_28d_rpe = (currentLog && rolling_avg_28d_rpe) ? (currentLog.rpe - rolling_avg_28d_rpe) : undefined;

    return {
        session_rpe_load,
        rolling_avg_28d_dist,
        rolling_avg_28d_rpe,
        rolling_median_8w_dist: rolling_median_8w_dist ?? 0,
        deviation_from_28d_dist,
        deviation_from_28d_rpe
    };
}


/**
 * データ結合とCSV向けフォーマット変換 (Long Format)
 * Update: 自動計算ロジックを追加
 */
export function generateAnalysisDataset(
    athlete: Athlete,
    bloodLabs: BloodLab[],
    dailyLogs: DailyLog[],
    nutritionReviews: NutritionReview[],
    treadmillTests: TreadmillTest[]
): AnalysisDataRow[] {

    const bloodMap = new Map(bloodLabs.map(b => [b.date, b]));
    const nutMap = new Map(nutritionReviews.map(n => [n.date, n]));
    const testMap = new Map(treadmillTests.map(t => [t.date, t]));
    const logMap = new Map(dailyLogs.map(l => [l.date, l]));

    const allDates = Array.from(new Set([
        ...bloodLabs.map(d => d.date),
        ...dailyLogs.map(d => d.date),
        ...nutritionReviews.map(d => d.date),
        ...treadmillTests.map(d => d.date)
    ])).sort();

    const rows: AnalysisDataRow[] = [];

    allDates.forEach(dateStr => {
        const blood = bloodMap.get(dateStr);
        const log = logMap.get(dateStr);
        const nut = nutMap.get(dateStr);
        const test = testMap.get(dateStr);

        // 【個人内基準値計算】
        // その日時点での過去データを渡す必要があるため、dailyLogs全体ではなく
        // dateStr以前のデータをフィルタリングする（パフォーマンス注意だが、クライアントサイド処理として実装）
        // 実際にはサーバーサイドやDBクエリで窓関数を使うべき処理。
        const pastLogs = dailyLogs.filter(d => d.date <= dateStr);
        const metrics = calculateRollingMetrics(dateStr, pastLogs);

        // 【自動計算: トレッドミル HR Drift】
        const calculatedHrDrift = test
            ? (test.second_half_hr_bpm - test.first_half_hr_bpm)
            : null;

        const row: AnalysisDataRow = {
            athlete_id: athlete.athlete_id,
            date: dateStr,

            ferritin: blood ? blood.ferritin_ng_ml : null,
            hb: blood ? blood.hemoglobin_g_dl : null,
            is_blood_test_day: blood ? 1 : 0,

            daily_dist_km: log ? log.training_distance_km : 0,
            daily_rpe: log ? log.rpe : null,
            sleep_quality: log ? log.sleep_quality : null,
            fatigue: log ? log.fatigue_level : null,
            has_dizziness: log?.symptom_dizziness ? 1 : 0,
            has_breathlessness: log?.symptom_breathlessness ? 1 : 0,

            energy_score: nut ? nut.energy_balance_score : null,
            iron_score: nut ? nut.iron_food_intake_score : null,

            hr_drift: calculatedHrDrift, // 計算値を使用

            // 追加: 自動計算項目
            session_load: metrics.session_rpe_load ?? null,
            rolling_avg_28d_rpe: metrics.rolling_avg_28d_rpe ? parseFloat(metrics.rolling_avg_28d_rpe.toFixed(2)) : null,
            dev_rpe: metrics.deviation_from_28d_rpe ? parseFloat(metrics.deviation_from_28d_rpe.toFixed(2)) : null
        };

        rows.push(row);
    });

    return rows;
}

/**
 * CSV出力 (Updated headers)
 */
export function formatDataToCSV(data: AnalysisDataRow[]): string {
    const headers = [
        'athlete_id', 'date',
        'ferritin', 'hb', 'is_blood_test_day',
        'daily_dist_km', 'daily_rpe',
        'session_load', // New
        'rolling_avg_28d_rpe', // New
        'dev_rpe', // New (Deviation)
        'sleep_quality', 'fatigue',
        'has_dizziness', 'has_breathlessness',
        'energy_score', 'iron_score', 'hr_drift'
    ];

    const csvRows = data.map(row => {
        return headers.map(header => {
            // @ts-expect-error key access
            const val = row[header];
            if (val === null || val === undefined || Number.isNaN(val)) return "NA";
            return val;
        }).join(',');
    });

    return [headers.join(','), ...csvRows].join('\n');
}
