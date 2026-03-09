import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/login-form'

export const metadata: Metadata = {
  title: '관리자 로그인 | Invoice',
}

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>
}

/**
 * 관리자 로그인 페이지 (Server Component)
 * callbackUrl searchParam으로 로그인 후 원래 페이지로 리다이렉트
 */
export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        {/* 헤더 */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">관리자 로그인</h1>
          <p className="text-muted-foreground text-sm">
            Invoice 관리자 페이지에 접근하려면 로그인하세요.
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  )
}
