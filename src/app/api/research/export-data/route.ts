
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const athleteId = searchParams.get('athleteId');

        // もし athleteId が指定されていない場合は最初の選手を対象にする（デモ用）
        let targetAthlete;
        if (athleteId) {
            targetAthlete = await prisma.athlete.findUnique({
                where: { id: athleteId },
                include: {
                    bloodTests: true,
                    dailyConditions: true,
                    trainingLoads: true,
                    nutritionLogs: true,
                }
            });
        } else {
            targetAthlete = await prisma.athlete.findFirst({
                include: {
                    bloodTests: true,
                    dailyConditions: true,
                    trainingLoads: true,
                    nutritionLogs: true,
                }
            });
        }

        if (!targetAthlete) {
            return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
        }

        // 型定義に合わせるためのマッピング
        const result = {
            athlete: {
                athlete_id: targetAthlete.id,
                name: targetAthlete.name,
                birth_year: targetAthlete.birthDate.getFullYear(),
                height_cm: 160, // Dummy as it's not in schema
                body_weight_kg: 50, // Dummy
            },
            bloodLabs: targetAthlete.bloodTests.map(b => ({
                athlete_id: targetAthlete.id,
                date: format(b.date, 'yyyy-MM-dd'),
                ferritin_ng_ml: b.ferritin,
                hemoglobin_g_dl: b.hemoglobin,
                serum_iron_ug_dl: b.serumIron || undefined,
            })),
            dailyLogs: targetAthlete.dailyConditions.map(d => ({
                athlete_id: targetAthlete.id,
                date: format(d.date, 'yyyy-MM-dd'),
                training_distance_km: 10, // Dummy or fetch from trainingLoads
                training_duration_min: 60, // Dummy
                rpe: d.subjectiveFatigue ? (d.subjectiveFatigue / 5) : 13, // Mapping VAS to Borg approx
                sleep_duration_h: 7.5,
                sleep_quality: d.sleepQuality || 3,
                fatigue_level: d.subjectiveFatigue ? Math.ceil(d.subjectiveFatigue / 20) : 3,
                symptom_dizziness: false,
                symptom_breathlessness: false,
                symptom_leg_heaviness: false,
            })),
            // TrainingLoad からも集約が必要だが、一旦シンプルにマッピング
            trainingLoads: targetAthlete.trainingLoads.map(l => ({
                athlete_id: targetAthlete.id,
                date: format(l.date, 'yyyy-MM-dd'),
                training_distance_km: l.totalDistance || 0,
                rpe: l.rpeSession || 0,
            })),
            nutrition: targetAthlete.nutritionLogs.map(n => ({
                athlete_id: targetAthlete.id,
                date: format(n.date, 'yyyy-MM-dd'),
                energy_balance_score: n.energyBalanceScore,
                iron_food_intake_score: n.ironFoodScore,
                carbohydrate_intake_score: n.carbohydrateScore,
            })),
            treadmill: [] // Not implemented in schema yet
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to export research data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
