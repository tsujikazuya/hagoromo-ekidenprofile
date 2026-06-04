import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const athletes = await prisma.athlete.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(athletes);
    } catch (error) {
        console.error('Failed to fetch athletes:', error);
        return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, birthDate, historyAnemia, baselineFerritin, role, loginId, password } = body;

        if (!name || !birthDate) {
            return NextResponse.json({ error: 'Name and Birth Date are required' }, { status: 400 });
        }

        const athlete = await prisma.athlete.create({
            data: {
                name,
                birthDate: new Date(birthDate),
                historyAnemia: !!historyAnemia,
                baselineFerritin: baselineFerritin ? parseFloat(baselineFerritin) : null,
                role: role || 'player',
                loginId: loginId || null,
                password: password ? Buffer.from(password).toString('base64') : null,
            },
        });

        return NextResponse.json(athlete);
    } catch (error) {
        console.error('Failed to create athlete:', error);
        return NextResponse.json({ error: 'Failed to create athlete' }, { status: 500 });
    }
}
