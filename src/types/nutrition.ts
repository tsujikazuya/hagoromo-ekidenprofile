
// Existing interfaces...
import { Athlete } from './anemia';

export interface MealInputData {
    athlete_id: string;
    date: string;       // YYYY-MM-DD
    time?: string;      // HH:mm
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    images: string[];
    supplementary_text?: string;
}

// Step 1: Image Recognition Types
export type FoodCategory =
    | 'staple'     // 主食
    | 'meat'       // 肉
    | 'seafood'    // 魚介
    | 'egg'        // 卵
    | 'soy'        // 大豆・豆製品
    | 'vegetable_green' // 野菜（緑黄色）
    | 'vegetable_pale'  // 野菜（淡色）
    | 'dairy'      // 乳製品
    | 'other';     // その他

export type PortionSize = 'small' | 'medium' | 'large';

export interface DetectedFoodItem {
    name: string;      // e.g. "牛ステーキ", "ほうれん草お浸し"
    category: FoodCategory;
    portion: PortionSize;
    confidence?: number;
}

// Step 2 & 3: Scoring Result (Hierarchical)
export interface MealAnalysisResult {
    analysis_id?: string;
    athlete_id: string;
    date: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';

    // Step 1: Image Analysis
    detected_items: DetectedFoodItem[];

    // Step 2: Semi-Quantitative Scores (Raw 0-3)
    hem_iron_score: number;      // 0-3
    non_hem_iron_score: number;  // 0-3
    absorption_enhancer_score: number; // 0-2 (VitC, Acid)

    // Step 3: Research Grades (-2 to +2)
    iron_intake_grade: number;   // -2 to +2
    carb_intake_grade: number;   // -2 to +2
    energy_balance_grade: number;// -2 to +2

    // Metadata
    inhibitor_flag: 0 | 1;       // 0:None, 1:Present
    supplement_recorded: boolean;
    menu_text: string;
    analysis_summary: string;
    reliability_level: 'A' | 'B' | 'C';
    image_url?: string;
}

// Final Database Record (Flat format requested by user)
export interface MealAnalysisRecord {
    athlete_id: string;
    date: string;       // YYYY-MM-DD
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';

    // Research Grades (-2 to +2)
    iron_food_score: number;
    carbohydrate_score: number;
    energy_balance_score: number;

    // Text Metadata
    detected_food_groups: string; // Comma separated categories or items
    notes?: string;               // User input + AI flags (supplements etc.)
}

export interface DailyNutritionScore {
    athlete_id: string;
    date: string;

    // Aggregated Grades
    daily_iron_grade: number;
    daily_energy_grade: number;

    has_inhibitor: 0 | 1;
    min_carb_grade: number;
}
