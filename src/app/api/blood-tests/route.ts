import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    try {
        await prisma.bloodTest.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const athleteId = searchParams.get('athleteId');

    try {
        const where = athleteId ? { athleteId } : {};
        const bloodTests = await prisma.bloodTest.findMany({
            where,
            orderBy: { date: 'desc' },
            include: { athlete: { select: { name: true } } }
        });
        return NextResponse.json(bloodTests);
    } catch (error) {
        console.error('Failed to fetch blood tests:', error);
        return NextResponse.json({ error: 'Failed to fetch blood tests' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { athleteId, date, hemoglobin, ferritin, serumIron, tibc, rbc, hematocrit, cpk } = body;

        if (!athleteId || !date || hemoglobin === undefined || ferritin === undefined) {
            return NextResponse.json({ error: 'Athlete ID, Date, Hb, and Ferritin are required' }, { status: 400 });
        }

        const bloodTest = await prisma.bloodTest.create({
            data: {
                athleteId,
                date: new Date(date),
                hemoglobin: parseFloat(hemoglobin),
                ferritin: parseFloat(ferritin),
                serumIron: serumIron ? parseFloat(serumIron) : null,
                tibc: tibc ? parseFloat(tibc) : null,
                rbc: rbc ? parseFloat(rbc) : null,
                hematocrit: hematocrit ? parseFloat(hematocrit) : null,
                cpk: cpk ? parseInt(cpk) : null,
            },
        });

        return NextResponse.json(bloodTest);
    } catch (error) {
        console.error('Failed to create blood test:', error);
        return NextResponse.json({ error: 'Failed to create blood test' }, { status: 500 });
    }
}
