import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function encodePassword(pwd: string) {
    return Buffer.from(pwd).toString('base64')
}

async function test() {
    const loginId = "Kazuya";
    const password = "kazuya1221"; // wait, I don't know the password they typed. But let's assume it's right.
    const normalizedId = loginId.replace(/\s+/g, '')
    const user = await prisma.athlete.findUnique({
        where: { loginId: normalizedId }
    })
    console.log("User:", user?.name)
    console.log("Password match:", user?.password === encodePassword(password))
}
test().finally(() => prisma.$disconnect())
