'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteAthlete(athleteId: string) {
    try {
        await prisma.athlete.delete({
            where: { id: athleteId }
        })
        // 全体のキャッシュを更新
        revalidatePath('/', 'layout')
        return { success: true }
    } catch (e: any) {
        console.error("Failed to delete athlete:", e)
        return { success: false, error: "削除中にエラーが発生しました。関連データに問題がある可能性があります。" }
    }
}
