
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // 指導者・スタッフ用ダッシュボードおよび関連APIの保護
    if (pathname.startsWith('/staff') || pathname.startsWith('/coach') || pathname.startsWith('/api/staff')) {
        const sessionCookie = request.cookies.get('auth_session');
        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        try {
            const session = JSON.parse(sessionCookie.value);
            if (session.role !== 'coach') {
                // 選手はホーム（選手ダッシュボード）へ強制リダイレクト
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (e) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // START: Temporary auth bypass for UI inspection (他のパス用)
    return NextResponse.next();
    // END: Temporary auth bypass
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
