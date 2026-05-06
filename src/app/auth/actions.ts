'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// セキュリティよりも手軽さを優先した簡易パスワードエンコード（実運用時はbcrypt等を推奨）
function encodePassword(pwd: string) {
    return Buffer.from(pwd).toString('base64')
}

export async function loginAction(formData: FormData) {
    const loginId = formData.get('loginId') as string
    const password = formData.get('password') as string
    
    const normalizedId = loginId.replace(/\s+/g, '')

    let redirectUrl = ''
    try {
        const user = await prisma.athlete.findFirst({
            where: { 
                loginId: {
                    equals: normalizedId,
                    mode: 'insensitive'
                }
            }
        })

        if (!user || user.password !== encodePassword(password)) {
            redirectUrl = '/login?error=' + encodeURIComponent('名前またはパスワードが間違っています')
        } else {
            // セッションCookieを発行 (1週間の有効期限)
            const cookieStore = await cookies()
            cookieStore.set('auth_session', JSON.stringify({
                userId: user.id,
                loginId: user.loginId,
                name: user.name,
                role: user.role
            }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/'
            })

            revalidatePath('/', 'layout')
            redirectUrl = user.role === 'coach' ? '/staff' : '/'
        }
    } catch (e: any) {
        console.error('Login error:', e)
        redirectUrl = '/login?error=' + encodeURIComponent('ログイン処理中にエラーが発生しました')
    }
    
    if (redirectUrl) {
        redirect(redirectUrl)
    }
}

export async function signUpAction(formData: FormData) {
    const name = formData.get('name') as string
    const loginId = (formData.get('loginId') as string) || name
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const role = formData.get('role') as string || 'player'

    if (password !== confirmPassword) {
        redirect('/register?error=' + encodeURIComponent('パスワードが一致しません'))
    }
    
    if (password.length < 4) {
        redirect('/register?error=' + encodeURIComponent('パスワードは4文字以上にしてください'))
    }

    const normalizedId = loginId.replace(/\s+/g, '')

    let redirectUrl = ''
    try {
        // 重複チェック
        const existing = await prisma.athlete.findFirst({
            where: { 
                loginId: {
                    equals: normalizedId,
                    mode: 'insensitive'
                }
            }
        })

        if (existing) {
            redirectUrl = '/register?error=' + encodeURIComponent('このログインIDはすでに登録されています')
        } else {
            // Prismaに保存
            await prisma.athlete.create({
                data: {
                    loginId: normalizedId,
                    name: name,
                    password: encodePassword(password),
                    role: role,
                    birthDate: new Date('2000-01-01'), // デフォルト日
                    historyAnemia: false,
                }
            })

            revalidatePath('/', 'layout')
            redirectUrl = '/login?message=' + encodeURIComponent('アカウントが正常に作成されました。ログインしてください。')
        }
    } catch (e: any) {
        console.error('Signup error:', e)
        redirectUrl = '/register?error=' + encodeURIComponent('アカウント作成に失敗しました')
    }

    if (redirectUrl) {
        redirect(redirectUrl)
    }
}

// 互換性維持用のスタブ
export async function login(formData: FormData) {
    redirect('/login?error=This method is deprecated')
}

export async function signup(formData: FormData) {
    redirect('/login?message=This method is deprecated')
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('auth_session')
    redirect('/login')
}

export async function demoLoginAction(role: 'player' | 'coach') {
    let redirectUrl = ''
    try {
        const testId = role === 'coach' ? 'test_coach' : 'test_player'
        const testName = role === 'coach' ? 'テスト監督' : 'テスト選手'
        
        let user = await prisma.athlete.findUnique({
            where: { loginId: testId }
        })

        if (!user) {
            user = await prisma.athlete.create({
                data: {
                    loginId: testId,
                    name: testName,
                    password: encodePassword('1234'),
                    role: role,
                    birthDate: new Date('2000-01-01'),
                    historyAnemia: false,
                }
            })
        }

        const cookieStore = await cookies()
        cookieStore.set('auth_session', JSON.stringify({
            userId: user.id,
            loginId: user.loginId,
            name: user.name,
            role: user.role
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/'
        })

        revalidatePath('/', 'layout')
        redirectUrl = user.role === 'coach' ? '/staff' : '/'
    } catch (e: any) {
        console.error('Demo Login error:', e)
        redirectUrl = '/login?error=' + encodeURIComponent('デモログインに失敗しました')
    }

    if (redirectUrl) {
        redirect(redirectUrl)
    }
}
