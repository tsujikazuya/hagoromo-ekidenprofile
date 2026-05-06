import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        await prisma.notice.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete notice:', error);
        return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { title, content, author, type } = body;

        const notice = await prisma.notice.update({
            where: { id },
            data: {
                title,
                content,
                author,
                type,
            },
        });
        return NextResponse.json(notice);
    } catch (error) {
        console.error('Failed to update notice:', error);
        return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 });
    }
}
