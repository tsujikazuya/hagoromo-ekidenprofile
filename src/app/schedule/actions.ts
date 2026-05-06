'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// セッションからユーザー情報を取得するユーティリティ
async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionStr = cookieStore.get('auth_session')?.value;
    if (!sessionStr) return null;
    return JSON.parse(sessionStr);
}

// 予定一覧の取得
export async function getSchedules() {
    try {
        const schedules = await prisma.schedule.findMany({
            orderBy: { date: 'asc' }
        });
        return { success: true, data: schedules };
    } catch (e: any) {
        console.error("Failed to fetch schedules:", e);
        return { success: false, error: e.message };
    }
}

// 予定の追加・更新
export async function upsertSchedule(data: {
    id?: string, // idがあれば更新、なければ新規作成
    date: Date,
    title: string,
    type: string,
    time?: string,
    location?: string,
    description?: string,
    targetTime?: string,
    lapTime?: string,
    isCompleted?: boolean,
}) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, error: "ログインが必要です" };
    }

    try {
        if (data.id) {
            // Update
            const updated = await prisma.schedule.update({
                where: { id: data.id },
                data: {
                    date: data.date,
                    title: data.title,
                    type: data.type,
                    time: data.time,
                    location: data.location,
                    description: data.description,
                    targetTime: data.targetTime,
                    lapTime: data.lapTime,
                    isCompleted: data.isCompleted ?? false,
                }
            });
            revalidatePath('/schedule');
            return { success: true, data: updated };
        } else {
            // Create
            const created = await prisma.schedule.create({
                data: {
                    date: data.date,
                    title: data.title,
                    type: data.type,
                    time: data.time,
                    location: data.location,
                    description: data.description,
                    targetTime: data.targetTime,
                    lapTime: data.lapTime,
                    isCompleted: data.isCompleted ?? false,
                }
            });
            revalidatePath('/schedule');
            return { success: true, data: created };
        }
    } catch (e: any) {
        console.error("Failed to upsert schedule:", e);
        return { success: false, error: e.message };
    }
}

// 予定の削除
export async function deleteSchedule(id: string) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, error: "ログインが必要です" };
    }

    try {
        await prisma.schedule.delete({
            where: { id }
        });
        revalidatePath('/schedule');
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete schedule:", e);
        return { success: false, error: e.message };
    }
}
