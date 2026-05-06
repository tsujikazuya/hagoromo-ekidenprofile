import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    if (!dateParam) {
        return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    try {
        const date = new Date(dateParam);
        
        // Find menus for the specific date
        const menus = await prisma.trainingMenu.findMany({
            where: {
                date: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lt: new Date(date.setHours(23, 59, 59, 999))
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return NextResponse.json(menus);
    } catch (error) {
        console.error('Failed to fetch training menus:', error);
        return NextResponse.json({ error: 'Failed to fetch training menus' }, { status: 500 });
    }
}
