export interface Athlete {
    athlete_id: string; // Primary Key
    name: string;
    birth_year: number;
    height_cm: number;
    body_weight_kg?: number;
    notes?: string;
}

export interface BloodLab {
    id?: string; // Optional internal ID
    athlete_id: string; // Foreign Key
    date: string; // YYYY-MM-DD
    ferritin_ng_ml: number; // Major Outcome
    hemoglobin_g_dl: number;
    serum_iron_ug_dl?: number;
    tsat_percent?: number;
    crp_mg_dl?: number;
    lab_notes?: string;
}

export interface NutritionReview {
    id?: string;
    athlete_id: string;
    date: string;
    energy_balance_score: number; // -2 to +2
    iron_food_intake_score: number; // -2 to +2
    carbohydrate_intake_score: number; // -2 to +2
    dietitian_comment?: string;
}

export interface TreadmillTest {
    id?: string;
    athlete_id: string;
    date: string;
    running_speed_kmh: number;
    avg_hr_bpm: number;
    first_half_hr_bpm: number;
    second_half_hr_bpm: number;
    hr_drift_bpm: number; // Auto-calculated (second - first) usually
    rpe: number; // 6-20
    test_notes?: string;
}

export interface DailyLog {
    id?: string;
    athlete_id: string;
    date: string;
    training_distance_km: number;
    training_duration_min: number;
    rpe: number;
    sleep_duration_h: number;
    sleep_quality: number; // 1-5
    fatigue_level: number; // 1-5
    symptom_dizziness: boolean;
    symptom_breathlessness: boolean;
    symptom_leg_heaviness: boolean;
    bowel_movement?: 'none' | 'hard' | 'normal' | 'soft';
    sweat_volume?: 'high' | 'normal' | 'low';
    hydration_during_practice?: 'high' | 'normal' | 'low';
}

// For Analysis Export
export interface AnalysisDataRow {
    athlete_id: string;
    date: string;
    // Outcomes
    ferritin: number | null;
    hb: number | null;

    // Daily Covariates (Aggregated or raw)
    daily_dist_km: number;
    daily_rpe: number | null;
    sleep_quality: number | null;
    fatigue: number | null;

    // Monthly/Periodic Covariates (Last observation carried forward or interpolated)
    energy_score: number | null;
    iron_score: number | null;

    // Test Data
    hr_drift: number | null;

    // Flags
    has_dizziness: 0 | 1;
    has_breathlessness: 0 | 1;
    is_blood_test_day: 0 | 1;

    // Derived Metrics
    session_load: number | null;
    rolling_avg_28d_rpe: number | null;
    dev_rpe: number | null;
}
