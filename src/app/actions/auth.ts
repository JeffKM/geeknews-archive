'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { validatePassword } from '@/lib/auth'

/** 세션 쿠키 이름 */
const SESSION_COOKIE_NAME = 'admin_session'
/** 세션 만료 시간: 1일 (초 단위) */
const SESSION_MAX_AGE = 60 * 60 * 24

/**
 * 로그인 Server Action
 * @param password 입력한 패스워드
 * @param callbackUrl 로그인 후 리다이렉트할 URL
 * @returns 에러 메시지 (성공 시 redirect로 종료)
 */
export async function loginAction(
  password: string,
  callbackUrl?: string
): Promise<{ error: string }> {
  if (!validatePassword(password)) {
    return { error: '패스워드가 올바르지 않습니다.' }
  }

  // 세션 쿠키 설정
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  // 로그인 성공 후 리다이렉트
  const redirectUrl =
    callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : '/admin/invoices'
  redirect(redirectUrl)
}

/**
 * 로그아웃 Server Action
 * 세션 쿠키 삭제 후 로그인 페이지로 리다이렉트
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  redirect('/admin/login')
}
