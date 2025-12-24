
import { Athlete, BloodLab, DailyLog, NutritionReview, TreadmillTest, AnalysisDataRow } from '@/types/anemia';
import { subDays, isWithinInterval, parseISO } from 'date-fns';

/**
 * ユーザー指定の厳密なCSV構造に合わせて型を拡張
 * もともとのAnalysisDataRowをベースにしつつ、要求されたフィールドを網羅する
 */
export interface AnalysisExportRow {
    athlete_id: string;
    date: string;
    ferritin_ng_ml: number | null;
    hemoglobin_g_dl: number | null;
    avg_hr_bpm: number | null;
    hr_drift_bpm: number | null;
    energy_balance_score: number | null;
    iron_food_intake_score: number | null;
    carbohydrate_intake_score: number | null;
    training_load: number | null;
    sleep_duration_h: number | null;
    sleep_quality: number | null;
    fatigue_level: number | null;
}

/**
 * CSV向けのヘッダー順序定義
 */
const EXPORT_HEADERS: (keyof AnalysisExportRow)[] = [
    'athlete_id',
    'date',
    'ferritin_ng_ml',
    'hemoglobin_g_dl',
    'avg_hr_bpm',
    'hr_drift_bpm',
    'energy_balance_score',
    'iron_food_intake_score',
    'carbohydrate_intake_score',
    'training_load',
    'sleep_duration_h',
    'sleep_quality',
    'fatigue_level'
];

/**
 * データセット生成ロジック
 */
export function generateExportDataset(
    athlete: Athlete,
    bloodLabs: BloodLab[],
    dailyLogs: DailyLog[],
    nutritionReviews: NutritionReview[],
    treadmillTests: TreadmillTest[]
): AnalysisExportRow[] {

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

    const rows: AnalysisExportRow[] = [];

    allDates.forEach(dateStr => {
        const blood = bloodMap.get(dateStr);
        const log = logMap.get(dateStr);
        const nut = nutMap.get(dateStr);
        const test = testMap.get(dateStr);

        const row: AnalysisExportRow = {
            athlete_id: athlete.athlete_id,
            date: dateStr,

            // Blood Data (測定日のみ値あり、他はNA)
            ferritin_ng_ml: blood ? blood.ferritin_ng_ml : null,
            hemoglobin_g_dl: blood ? blood.hemoglobin_g_dl : null,

            // Treadmill Test
            avg_hr_bpm: test ? test.avg_hr_bpm : null,
            hr_drift_bpm: test
                ? (test.hr_drift_bpm ?? (test.second_half_hr_bpm - test.first_half_hr_bpm))
                : null,

            // Nutrition Review
            energy_balance_score: nut ? nut.energy_balance_score : null,
            iron_food_intake_score: nut ? nut.iron_food_intake_score : null,
            carbohydrate_intake_score: nut ? nut.carbohydrate_intake_score : null,

            // Daily Logs
            training_load: log ? (log.training_duration_min * log.rpe) : 0, // 練習なし=0
            sleep_duration_h: log ? log.sleep_duration_h : null,
            sleep_quality: log ? log.sleep_quality : null,
            fatigue_level: log ? log.fatigue_level : null
        };

        rows.push(row);
    });

    return rows;
}

/**
 * CSVフォーマット変換
 * @param data データ配列
 * @param missingPlaceholder 欠測値の表現 (default: "NA" for R/Stan, "" for SPSS/Excel)
 */
export function formatExportCSV(data: AnalysisExportRow[], missingPlaceholder: string = "NA"): string {
    const csvRows = data.map(row => {
        return EXPORT_HEADERS.map(header => {
            const val = row[header];
            if (val === null || val === undefined) return missingPlaceholder;
            return val;
        }).join(',');
    });

    return [EXPORT_HEADERS.join(','), ...csvRows].join('\n');
}

// -------------------------------------------------------------
// Legacy Functions (for compatibility with existing UI if needed)
// -------------------------------------------------------------
import { CalculatedMetrics } from './anemiaLogic';
// Re-export type if needed or keep this file clean. 
// Assuming `CalculatedMetrics` is used elsewhere, we shouldn't break the build if it was imported from here.
// But it was imported from ./anemiaLogic which is separate. 
