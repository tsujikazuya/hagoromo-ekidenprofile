import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: { date: 'desc' },
        });
        return NextResponse.json(notices);
    } catch (error) {
        console.error('Failed to fetch notices:', error);
        return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, author, type } = body;

        if (!title || !content || !author) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const notice = await prisma.notice.create({
            data: {
                title,
                content,
                author,
                type: type || 'normal',
                date: new Date(),
            },
        });
        return NextResponse.json(notice);
    } catch (error) {
        console.error('Failed to create notice:', error);
        return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
    }
}
