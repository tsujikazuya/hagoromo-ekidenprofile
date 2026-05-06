'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionStr = cookieStore.get('auth_session')?.value;
    if (!sessionStr) return null;
    return JSON.parse(sessionStr);
}

export async function getTrainingMenus() {
    try {
        const menus = await prisma.trainingMenu.findMany({
            orderBy: { date: 'asc' }
        });
        return { success: true, data: menus };
    } catch (e: any) {
        console.error("Failed to fetch training menus:", e);
        return { success: false, error: e.message };
    }
}

export async function upsertTrainingMenu(data: {
    id?: string,
    date: Date,
    type: string,
    title: string,
    content?: string,
    distance?: string,
    targetTime?: string,
}) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, error: "ログインが必要です" };
    }

    // Allow staff/coach or user role based permission
    // For demo, we just allow anyone or role check if needed
    // if (user.role !== 'staff' && user.role !== 'coach' && user.role !== 'manager') {
    //     return { success: false, error: "権限がありません" };
    // }

    try {
        if (data.id) {
            const updated = await prisma.trainingMenu.update({
                where: { id: data.id },
                data: {
                    date: data.date,
                    type: data.type,
                    title: data.title,
                    content: data.content,
                    distance: data.distance,
                    targetTime: data.targetTime,
                    author: user.name || "coach",
                }
            });
            revalidatePath('/training');
            return { success: true, data: updated };
        } else {
            const created = await prisma.trainingMenu.create({
                data: {
                    date: data.date,
                    type: data.type,
                    title: data.title,
                    content: data.content,
                    distance: data.distance,
                    targetTime: data.targetTime,
                    author: user.name || "coach",
                }
            });
            revalidatePath('/training');
            return { success: true, data: created };
        }
    } catch (e: any) {
        console.error("Failed to upsert training menu:", e);
        return { success: false, error: e.message };
    }
}

export async function deleteTrainingMenu(id: string) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, error: "ログインが必要です" };
    }

    try {
        await prisma.trainingMenu.delete({
            where: { id }
        });
        revalidatePath('/training');
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete training menu:", e);
        return { success: false, error: e.message };
    }
}
