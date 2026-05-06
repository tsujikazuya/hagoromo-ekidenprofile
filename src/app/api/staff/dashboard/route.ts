import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const athletes = await prisma.athlete.findMany({
            include: {
                dailyConditions: {
                    orderBy: { date: 'desc' },
                    take: 1
                },
                bloodTests: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            }
        });

        // Determine today's start and end for "submittedToday"
        const todayText = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
        let submittedTodayCount = 0;
        let warningCount = 0;

        const processedAthletes = athletes.filter(a => a.role === 'player').map(athlete => {
            const condition = athlete.dailyConditions[0];
            const blood = athlete.bloodTests[0];

            let submitted = false;
            let status = 'unknown';
            let fatigue = 0;
            
            if (condition) {
                const conditionDateText = new Date(condition.date).toISOString().split('T')[0];
                if (conditionDateText === todayText) {
                    submitted = true;
                    submittedTodayCount++;
                }
                
                fatigue = condition.subjectiveFatigue || 0;
                if (fatigue > 80) {
                    status = 'danger';
                    warningCount++;
                } else if (fatigue > 60) {
                    status = 'warning';
                    warningCount++;
                } else if (submitted) {
                    status = 'ok';
                }
            }

            if (blood && blood.ferritin < 30) {
                if (status !== 'danger') {
                    status = 'warning';
                }
            }

            return {
                id: athlete.id,
                name: athlete.name,
                status,
                fatigue,
                submitted,
                latestCondition: condition || null,
                latestBloodTest: blood || null
            };
        });

        const processedCoaches = athletes.filter(a => a.role === 'coach').map(coach => {
            return {
                id: coach.id,
                name: coach.name,
                status: 'ok',
                fatigue: 0,
                submitted: false,
                latestCondition: null,
                latestBloodTest: null
            };
        });

        const teamStatus = {
            total: processedAthletes.length,
            submittedToday: submittedTodayCount,
            warnings: warningCount
        };

        return NextResponse.json({
            teamStatus,
            athletes: processedAthletes,
            coaches: processedCoaches
        });
    } catch (error) {
        console.error('Error fetching staff dashboard data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
