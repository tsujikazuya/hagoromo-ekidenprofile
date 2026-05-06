import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, totalDistance, rpeSession, feedback } = body;

        // For prototype: Find the first athlete or create a demo one
        let athlete = await prisma.athlete.findFirst();
        if (!athlete) {
            athlete = await prisma.athlete.create({
                data: {
                    name: "Demo Athlete",
                    birthDate: new Date("2000-01-01"),
                }
            });
        }

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        const trainingLoad = await prisma.trainingLoad.create({
            data: {
                athleteId: athlete.id,
                date: new Date(date),
                totalDistance: totalDistance ? parseFloat(totalDistance) : null,
                rpeSession: rpeSession ? parseInt(rpeSession) : null,
                feedback: feedback || null,
                // trimp is not calculated in this simple prototype
            },
        });

        return NextResponse.json(trainingLoad);
    } catch (error) {
        console.error('Failed to create training load:', error);
        return NextResponse.json({ error: 'Failed to create training load' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        // Simple fetch for verification/debugging
        const trainingLoads = await prisma.trainingLoad.findMany({
            orderBy: { date: 'desc' },
            take: 10,
            include: { athlete: true }
        });
        return NextResponse.json(trainingLoads);
    } catch (error) {
        console.error('Failed to fetch training loads:', error);
        return NextResponse.json({ error: 'Failed to fetch training loads' }, { status: 500 });
    }
}
