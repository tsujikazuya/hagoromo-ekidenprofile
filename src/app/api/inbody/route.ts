import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const athleteId = searchParams.get('athleteId');

    try {
        const where = athleteId ? { athleteId } : {};
        const measurements = await prisma.inBodyMeasurement.findMany({
            where,
            orderBy: { date: 'desc' },
            include: { athlete: { select: { name: true } } }
        });
        return NextResponse.json(measurements);
    } catch (error) {
        console.error('Failed to fetch InBody measurements:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            athleteId, date,
            weight, skeletalMuscleMass, bodyFatMass, bodyFatPercent, bmi,
            totalBodyWater, proteinMass, mineralMass, bmr,
            muscleRightArm, muscleLeftArm, muscleTrunk, muscleRightLeg, muscleLeftLeg,
            notes
        } = body;

        if (!athleteId || !date) {
            return NextResponse.json({ error: 'athleteId and date are required' }, { status: 400 });
        }

        const f = (v: unknown) => (v !== undefined && v !== '' && v !== null ? parseFloat(v as string) : null);
        const i = (v: unknown) => (v !== undefined && v !== '' && v !== null ? parseInt(v as string) : null);

        const measurement = await prisma.inBodyMeasurement.create({
            data: {
                athleteId,
                date: new Date(date),
                weight: f(weight),
                skeletalMuscleMass: f(skeletalMuscleMass),
                bodyFatMass: f(bodyFatMass),
                bodyFatPercent: f(bodyFatPercent),
                bmi: f(bmi),
                totalBodyWater: f(totalBodyWater),
                proteinMass: f(proteinMass),
                mineralMass: f(mineralMass),
                bmr: i(bmr),
                muscleRightArm: f(muscleRightArm),
                muscleLeftArm: f(muscleLeftArm),
                muscleTrunk: f(muscleTrunk),
                muscleRightLeg: f(muscleRightLeg),
                muscleLeftLeg: f(muscleLeftLeg),
                notes: notes || null,
            },
        });

        return NextResponse.json(measurement);
    } catch (error) {
        console.error('Failed to create InBody measurement:', error);
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    try {
        await prisma.inBodyMeasurement.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
