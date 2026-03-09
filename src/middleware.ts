import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'

/**
 * 관리자 라우트 보호 미들웨어
 * /admin/** 경로에서 세션 쿠키 검증
 * 미인증 시 /admin/login?callbackUrl=...으로 리다이렉트
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/login 페이지는 인증 없이 접근 가능
  if (pathname.startsWith('/admin/login')) {
    // 이미 인증된 경우 /admin/invoices로 리다이렉트
    if (getSession(request)) {
      return NextResponse.redirect(new URL('/admin/invoices', request.url))
    }
    return NextResponse.next()
  }

  // 세션이 없으면 로그인 페이지로 리다이렉트
  if (!getSession(request)) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
