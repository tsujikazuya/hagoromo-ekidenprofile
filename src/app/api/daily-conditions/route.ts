import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const athleteId = searchParams.get('athleteId');
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!athleteId) {
        return NextResponse.json({ error: 'Athlete ID is required' }, { status: 400 });
    }

    try {
        const where: any = { athleteId };
        if (start && end) {
            where.date = {
                gte: new Date(start),
                lte: new Date(end)
            };
        }

        const conditions = await prisma.dailyCondition.findMany({
            where,
            orderBy: { date: 'asc' }
        });
        return NextResponse.json(conditions);
    } catch (error) {
        console.error('Failed to fetch daily conditions:', error);
        return NextResponse.json({ error: 'Failed to fetch daily conditions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { athleteId, date, mensesStatus, restingHeartRate, sleepQuality, subjectiveFatigue, morningWeight } = body;

        if (!athleteId || !date) {
            return NextResponse.json({ error: 'Athlete ID and Date are required' }, { status: 400 });
        }

        const condition = await prisma.dailyCondition.create({
            data: {
                athleteId,
                date: new Date(date),
                mensesStatus: mensesStatus ? parseInt(mensesStatus) : 0,
                restingHeartRate: restingHeartRate ? parseInt(restingHeartRate) : null,
                sleepQuality: sleepQuality ? parseInt(sleepQuality) : null,
                subjectiveFatigue: subjectiveFatigue ? parseInt(subjectiveFatigue) : null,
                morningWeight: morningWeight ? parseFloat(morningWeight) : null,
            },
        });

        return NextResponse.json(condition);
    } catch (error) {
        console.error('Failed to create daily condition:', error);
        return NextResponse.json({ error: 'Failed to create daily condition' }, { status: 500 });
    }
}
