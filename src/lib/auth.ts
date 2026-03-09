import type { NextRequest, NextResponse } from 'next/server'

/** 세션 쿠키 이름 */
const SESSION_COOKIE_NAME = 'admin_session'
/** 세션 쿠키 값 (고정 문자열) */
const SESSION_VALUE = 'authenticated'
/** 세션 만료 시간: 1일 (초 단위) */
const SESSION_MAX_AGE = 60 * 60 * 24

/**
 * 입력 패스워드가 환경변수 ADMIN_PASSWORD와 일치하는지 검증
 */
export function validatePassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  return password === adminPassword
}

/**
 * 응답 객체에 세션 쿠키 설정 (httpOnly + secure)
 */
export function setSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/**
 * 요청에서 세션 쿠키를 읽어 유효성 검증
 * @returns 세션이 유효하면 true, 아니면 false
 */
export function getSession(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
  return sessionCookie?.value === SESSION_VALUE
}

/**
 * 응답 객체에서 세션 쿠키 삭제
 */
export function clearSession(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE_NAME)
}
