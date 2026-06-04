
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        // 選手を削除。カスケード設定により関連データも削除される。
        await prisma.athlete.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to delete athlete via API:', error);
        return NextResponse.json(
            { error: 'メンバーの削除に失敗しました', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const athlete = await prisma.athlete.findUnique({
            where: { id },
            include: {
                bloodTests: true,
                dailyConditions: true,
                trainingLoads: true,
                nutritionLogs: true,
            }
        });

        if (!athlete) {
            return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
        }

        return NextResponse.json(athlete);
    } catch (error) {
        console.error('Failed to fetch athlete:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
