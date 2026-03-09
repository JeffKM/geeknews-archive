import type { Metadata } from 'next'
import { AdminNav } from '@/components/admin/admin-nav'
import { ThemeToggle } from '@/components/theme-toggle'

export const metadata: Metadata = {
  title: {
    template: '%s | Invoice 관리자',
    default: 'Invoice 관리자',
  },
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * 관리자 전용 레이아웃 (Server Component)
 * 헤더(네비게이션 + 테마 토글) + 메인 콘텐츠 영역
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background min-h-screen">
      <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* 로고 / 사이트명 */}
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold">Invoice 관리자</span>
            <AdminNav />
          </div>

          {/* 테마 토글 */}
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
