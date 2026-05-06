'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteAthlete(athleteId: string) {
    try {
        await prisma.athlete.delete({
            where: { id: athleteId }
        })
        revalidatePath('/staff', 'layout')
        revalidatePath('/coach', 'layout')
        return { success: true }
    } catch (e: any) {
        console.error("Failed to delete athlete:", e)
        return { success: false, error: e.message }
    }
}
