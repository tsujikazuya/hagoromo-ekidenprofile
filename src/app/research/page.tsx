
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateExportDataset, formatExportCSV } from '@/lib/anemiaExport';
import { Athlete, BloodLab, DailyLog, NutritionReview, TreadmillTest } from '@/types/anemia';
import { AthleteInputMockup } from '@/components/research/AthleteInputMockup';
import { StaffInputMockup } from '@/components/research/StaffInputMockup';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MealInputMockup } from '@/components/research/MealInputMockup';

export default function ResearchPortal() {
    const [csvPreview, setCsvPreview] = useState<string>("");
    const [spssMode, setSpssMode] = useState<boolean>(false);

    const handleGenerateValues = () => {
        // 1. Athlete (Static)
        const athlete: Athlete = {
            athlete_id: "STU_001",
            name: "Taro Hanako",
            birth_year: 2004,
            height_cm: 162.5,
            body_weight_kg: 51.0,
            notes: "High risk group"
        };

        // 2. BloodLab (Periodic: q3-4m)
        const bloodLabs: BloodLab[] = [
            { athlete_id: "STU_001", date: "2024-04-10", ferritin_ng_ml: 35, hemoglobin_g_dl: 13.5, serum_iron_ug_dl: 90 },
            { athlete_id: "STU_001", date: "2024-07-15", ferritin_ng_ml: 18, hemoglobin_g_dl: 12.1, serum_iron_ug_dl: 45 },
        ];

        // 3. Nutrition (Periodic: Monthly)
        const nutrition: NutritionReview[] = [
            { athlete_id: "STU_001", date: "2024-04-15", energy_balance_score: 0, iron_food_intake_score: 1, carbohydrate_intake_score: 0, dietitian_comment: "Good" },
            { athlete_id: "STU_001", date: "2024-05-15", energy_balance_score: -1, iron_food_intake_score: -1, carbohydrate_intake_score: -1, dietitian_comment: "Lack of energy" },
        ];

        // 4. Treadmill (Periodic: Monthly)
        const treadmill: TreadmillTest[] = [
            {
                athlete_id: "STU_001", date: "2024-04-20", running_speed_kmh: 12.0,
                avg_hr_bpm: 150, first_half_hr_bpm: 148, second_half_hr_bpm: 152, hr_drift_bpm: 4, rpe: 13
            }
        ];

        // 5. DailyLog (Daily)
        const dailyLogs: DailyLog[] = [
            { athlete_id: "STU_001", date: "2024-04-10", training_distance_km: 12, training_duration_min: 60, rpe: 13, sleep_duration_h: 7.5, sleep_quality: 4, fatigue_level: 2, symptom_dizziness: false, symptom_breathlessness: false, symptom_leg_heaviness: false },
            { athlete_id: "STU_001", date: "2024-04-11", training_distance_km: 16, training_duration_min: 80, rpe: 15, sleep_duration_h: 6.0, sleep_quality: 2, fatigue_level: 4, symptom_dizziness: true, symptom_breathlessness: false, symptom_leg_heaviness: true },
            { athlete_id: "STU_001", date: "2024-07-15", training_distance_km: 10, training_duration_min: 50, rpe: 18, sleep_duration_h: 7.0, sleep_quality: 3, fatigue_level: 5, symptom_dizziness: true, symptom_breathlessness: true, symptom_leg_heaviness: true },
        ];

        // Use Export Logic with Toggle
        const exportData = generateExportDataset(athlete, bloodLabs, dailyLogs, nutrition, treadmill);
        // SPSS Mode: Use empty string "", R (Standard) Mode: Use "NA"
        const missingVal = spssMode ? "" : "NA";
        const csv = formatExportCSV(exportData, missingVal);
        setCsvPreview(csv);
    };

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">貧血研究用データ基盤 (v2.9)</h1>
                <p className="text-sm md:text-base text-muted-foreground mr-4">
                    Strict CSV Output & Meal Analysis AI Logic (Step 1-4)
                </p>
            </div>

            <Tabs defaultValue="ai-logic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                    <TabsTrigger value="ui-design">UI Design</TabsTrigger>
                    <TabsTrigger value="models">Data Models</TabsTrigger>
                    <TabsTrigger value="ai-logic">Meal AI Logic</TabsTrigger>
                    <TabsTrigger value="export">CSV Export</TabsTrigger>
                </TabsList>

                <TabsContent value="ui-design" className="space-y-8 mt-6">
                    {/* Athlete Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                1. 選手用 UI
                            </h2>
                            <div className="text-sm text-slate-600 space-y-2">
                                <p>日常の負担を最小限にするため、タブ切り替えで1画面に統合。</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li><strong>日常</strong>: 体重、月経記録</li>
                                    <li><strong>練習</strong>: 距離、時間、RPE</li>
                                    <li><strong>体調</strong>: 睡眠、疲労、自覚症状</li>
                                </ul>
                            </div>
                        </div>
                        <div className="lg:col-span-8 flex justify-center bg-gray-200 p-8 rounded-xl">
                            {/* Mobile Simulator Frame */}
                            <div className="w-[375px] bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
                                <div className="h-6 bg-gray-800 w-full flex justify-center"><div className="w-20 h-4 bg-black rounded-b-xl"></div></div>
                                <div className="h-[667px] overflow-y-auto bg-slate-50">
                                    <AthleteInputMockup />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-12 border-t border-slate-200" />

                    {/* Staff Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                2. スタッフ用 UI
                            </h2>
                            <div className="text-sm text-slate-600 space-y-2">
                                <p>専門的な測定データを月次・不定期で入力するための管理画面。</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li><strong>閲覧権限</strong>: 全選手のデータにアクセス可能</li>
                                    <li><strong>入力形式</strong>: 選択式を多用し、入力揺れを防ぐ</li>
                                    <li><strong>区分</strong>: 栄養 / 血液 / トレッドミル試験</li>
                                </ul>
                            </div>
                        </div>
                        <div className="lg:col-span-8">
                            <StaffInputMockup />
                        </div>
                    </div>

                </TabsContent>

                <TabsContent value="models">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ModelCard title="Athlete" fields={["athlete_id", "name", "birth_year", "height/weight"]} type="Static" />
                        <ModelCard title="BloodLab" fields={["date", "ferritin (Outcome)", "Hb", "Serum Iron", "TSAT/CRP"]} type="Periodic (Yearly 2-4)" color="border-red-500" />
                        <ModelCard title="NutritionReview" fields={["date", "energy_score (-2~2)", "iron_score", "dietitian_comment"]} type="Monthly" color="border-green-500" />
                        <ModelCard title="TreadmillTest" fields={["date", "HR Drift", "run_speed", "avg_hr"]} type="Monthly" color="border-blue-500" />
                        <ModelCard title="DailyLog" fields={["date", "distance/duration", "RPE", "Sleep/Fatigue", "Symptoms (Binary)"]} type="Daily" color="border-orange-500" />
                    </div>
                </TabsContent>

                <TabsContent value="ai-logic">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Input Mockup */}
                        <div className="lg:col-span-4 space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Input Interface
                            </h3>
                            <div className="bg-gray-100 p-6 rounded-xl flex justify-center">
                                <div className="w-full max-w-[350px]">
                                    <MealInputMockup />
                                </div>
                            </div>
                            <div className="text-sm text-slate-600 space-y-2 mt-4">
                                <p><strong>入力仕様:</strong></p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>食事画像: 1食につき1〜3枚 (必須)</li>
                                    <li>補足テキスト: 状況や特記事項 (任意)</li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: AI Logic & Output */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Step 1: Image Recognition Logic */}
                            <Card className="border-l-4 border-indigo-500">
                                <CardHeader>
                                    <CardTitle className="text-indigo-700">Step 1: Image Recognition (Categorization)</CardTitle>
                                    <CardDescription>
                                        画像から食品群と概算量を推定します（数値推定は行いません）。
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="bg-slate-50 p-3 rounded">
                                            <strong className="block mb-2 text-slate-700">Category Detection</strong>
                                            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                                                <li>主食 (Rice/Bread/Noodles)</li>
                                                <li>肉 (Red/Processed/Chicken)</li>
                                                <li>魚介 (Fish/Shellfish)</li>
                                                <li>卵 (Egg)</li>
                                                <li>大豆 (Soy products)</li>
                                                <li>野菜 (Green/Pale)</li>
                                                <li>乳製品 (Dairy)</li>
                                            </ul>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded">
                                            <strong className="block mb-2 text-slate-700">Portion Estimation</strong>
                                            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                                                <li><strong>Small</strong>: 少なめ</li>
                                                <li><strong>Medium</strong>: 適量 (1人前)</li>
                                                <li><strong>Large</strong>: 多め</li>
                                                <li className="text-red-500 mt-2 font-bold no-list-style">※ g/kcal等の数値予測は禁止</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Step 2: Scoring Logic */}
                            <Card className="border-l-4 border-rose-500">
                                <CardHeader>
                                    <CardTitle className="text-rose-700">Step 2: Semi-Quantitative Scoring</CardTitle>
                                    <CardDescription>
                                        Step 1 の結果に基づき、鉄欠乏・EAリスク評価のためのスコア（0-3）を算出します。
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border rounded-md p-4 bg-slate-50">
                                            <h3 className="font-bold text-rose-700 mb-2">1. Hem-Iron Score (0-3)</h3>
                                            <p className="text-sm text-slate-600 mb-2">赤身肉、魚（血合い）の充実度</p>
                                            <ul className="text-xs list-disc pl-4 space-y-1">
                                                <li><strong>3</strong>: 牛ステーキ、レバー、カツオ (高密度)</li>
                                                <li><strong>2</strong>: 豚肉炒め、焼き魚1尾 (標準)</li>
                                                <li><strong>1</strong>: ハム、ひき肉少量 (少量)</li>
                                                <li><strong>0</strong>: なし</li>
                                            </ul>
                                        </div>
                                        <div className="border rounded-md p-4 bg-slate-50">
                                            <h3 className="font-bold text-green-700 mb-2">2. Non-Hem Iron Score (0-3)</h3>
                                            <p className="text-sm text-slate-600 mb-2">大豆製品、緑黄色野菜、卵</p>
                                            <ul className="text-xs list-disc pl-4 space-y-1">
                                                <li><strong>3</strong>: 納豆＋小松菜＋卵など複数品目</li>
                                                <li><strong>2</strong>: 副菜2品程度 (標準)</li>
                                                <li><strong>1</strong>: 副菜1品 (冷奴のみ等)</li>
                                                <li><strong>0</strong>: なし</li>
                                            </ul>
                                        </div>
                                        <div className="border rounded-md p-4 bg-slate-50">
                                            <h3 className="font-bold text-orange-700 mb-2">3. Absorption Enhancer (0-2)</h3>
                                            <p className="text-sm text-slate-600 mb-2">ビタミンC、酸（果物、生野菜）</p>
                                            <ul className="text-xs list-disc pl-4 space-y-1">
                                                <li><strong>2</strong>: 果物1個、100%ジュース、サラダボウル</li>
                                                <li><strong>1</strong>: つけあわせキャベツ、ドレッシング</li>
                                                <li><strong>0</strong>: なし</li>
                                            </ul>
                                        </div>
                                        <div className="border rounded-md p-4 bg-slate-50">
                                            <h3 className="font-bold text-blue-700 mb-2">4. Carbohydrate Score (0-3)</h3>
                                            <p className="text-sm text-slate-600 mb-2">エネルギー可用性プロキシ（主食量）</p>
                                            <ul className="text-xs list-disc pl-4 space-y-1">
                                                <li><strong>3</strong>: 大盛り、主食重ね食べ (リカバリー食)</li>
                                                <li><strong>2</strong>: どんぶり飯、パスタ1人前 (標準)</li>
                                                <li><strong>1</strong>: 茶碗半分 (少なめ)</li>
                                                <li><strong>0</strong>: 抜き、極端に少ない (不足)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Step 3: Research Grading Logic */}
                            <Card className="border-l-4 border-emerald-500">
                                <CardHeader>
                                    <CardTitle className="text-emerald-700">Step 3: Research Grading (-2 ~ +2)</CardTitle>
                                    <CardDescription>
                                        Step 2 を統合し、統計解析に用いる最終的な充足度グレードを判定します。
                                        <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">サプリメント対象外</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                                            <h4 className="font-bold text-emerald-800 mb-2">Iron Intake (-2~+2)</h4>
                                            <p className="text-xs text-emerald-700 mb-2">鉄関連食品スコア (Total Iron)</p>
                                            <ul className="text-xs space-y-1">
                                                <li><strong>+2 (十分)</strong>: ヘム鉄(Many) + 非ヘム鉄</li>
                                                <li><strong>+1 (まずまず)</strong>: ヘム鉄(Many) or 非ヘム鉄(Many)</li>
                                                <li><strong>0 (普通)</strong>: 平均的</li>
                                                <li><strong>-1 (不足)</strong>: 肉魚なし</li>
                                                <li><strong>-2 (欠乏)</strong>: 具なし</li>
                                            </ul>
                                        </div>
                                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                                            <h4 className="font-bold text-emerald-800 mb-2">Carb Intake (-2~+2)</h4>
                                            <p className="text-xs text-emerald-700 mb-2">炭水化物スコア</p>
                                            <ul className="text-xs space-y-1">
                                                <li><strong>+2 (十分)</strong>: 大盛り・リカバリー</li>
                                                <li><strong>+1 (適量)</strong>: 1人前</li>
                                                <li><strong>0 (普通)</strong>: 少なめ</li>
                                                <li><strong>-1 (不足)</strong>: 半分以下</li>
                                                <li><strong>-2 (欠乏)</strong>: 抜き</li>
                                            </ul>
                                        </div>
                                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                                            <h4 className="font-bold text-emerald-800 mb-2">Energy Balance (-2~+2)</h4>
                                            <p className="text-xs text-emerald-700 mb-2">エネルギーバランススコア</p>
                                            <ul className="text-xs space-y-1">
                                                <li><strong>+2 (十分)</strong>: 練習量に見合う</li>
                                                <li><strong>0 (均衡)</strong>: プラマイゼロ</li>
                                                <li><strong>-2 (欠乏)</strong>: 欠食・極端制限</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Step 4: Database Storage */}
                            <Card className="border-l-4 border-slate-700 bg-slate-900 text-slate-50">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        Step 4: Save & Export (Database)
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">
                                        統計解析用に正規化されたフラットな形式で一意に保存されます。
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-slate-300">
                                            <thead className="text-xs text-slate-100 uppercase bg-slate-800">
                                                <tr>
                                                    <th className="px-3 py-2">Field</th>
                                                    <th className="px-3 py-2">Type</th>
                                                    <th className="px-3 py-2">Value Example</th>
                                                    <th className="px-3 py-2">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700">
                                                <tr><td className="px-3 py-2 font-mono text-emerald-400">athlete_id</td><td>string</td><td>"STU_001"</td><td>選手ID</td></tr>
                                                <tr><td className="px-3 py-2 font-mono text-emerald-400">date</td><td>date</td><td>"2024-04-10"</td><td>日付</td></tr>
                                                <tr><td className="px-3 py-2 font-mono text-emerald-400">meal_type</td><td>enum</td><td>"dinner"</td><td>食事区分</td></tr>
                                                <tr><td className="px-3 py-2 font-mono text-emerald-400">iron_food_score</td><td>int</td><td className="text-yellow-400">2</td><td>Iron Intake (-2~+2)</td></tr>
                                                <tr><td className="px-3 py-2 font-mono text-emerald-400">carbohydrate_score</td><td>int</td><td className="text-yellow-400">1</td><td>Carb Intake (-2~+2)</td></tr>
                                                <tr><td className="px-3 py-2 font-mono text-emerald-400">energy_balance_score</td><td>int</td><td className="text-yellow-400">2</td><td>Energy Balance (-2~+2)</td></tr>
                                                <tr><td className="px-3 py-2 font-mono text-emerald-400">detected_food_groups</td><td>text</td><td>"肉(牛), 野菜(緑黄色)"</td><td>検出食品群</td></tr>
                                                <tr><td className="px-3 py-2 font-mono text-emerald-400">notes</td><td>text</td><td>"練習後, サプリあり"</td><td>補足メモ＋AI付記</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="export">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Ready CSV</CardTitle>
                            <CardDescription>
                                指定されたフォーマットによるStrict CSV Export。<br />
                                縦断解析（ベイズ階層モデル）向けに、<code>athlete_id</code> + <code>date</code> をキーとして日次・週次・採血前移動平均（7/14/28日）への集約が可能な構造で出力されます。
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2 mb-4 bg-slate-100 p-3 rounded-md w-fit">
                                <Checkbox
                                    id="spss-mode"
                                    checked={spssMode}
                                    onCheckedChange={(c) => setSpssMode(!!c)}
                                />
                                <Label htmlFor="spss-mode" className="text-sm font-medium leading-none cursor-pointer">
                                    SPSS互換モード (欠測値を空欄にする)
                                </Label>
                            </div>

                            <Button onClick={handleGenerateValues} className="mb-4">Generate Analysis CSV</Button>

                            {csvPreview && (
                                <div className="bg-slate-950 p-4 rounded text-xs font-mono text-white overflow-x-auto whitespace-pre">
                                    {csvPreview}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ModelCard({ title, fields, type, color = "border-slate-200" }: { title: string, fields: string[], type: string, color?: string }) {
    return (
        <Card className={`border-t-4 ${color}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{type}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-4 text-sm space-y-1">
                    {fields.map(f => <li key={f}>{f}</li>)}
                </ul>
            </CardContent>
        </Card>
    )
}
