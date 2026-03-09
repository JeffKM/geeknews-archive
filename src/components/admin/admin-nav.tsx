'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  {
    href: '/admin',
    label: '대시보드',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/admin/invoices',
    label: '견적서 목록',
    icon: FileText,
    exact: false,
  },
]

/**
 * 관리자 네비게이션 메뉴 (Client Component)
 * usePathname으로 현재 경로 기반 active 상태 표시
 */
export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="관리자 메뉴">
      <ul className="flex items-center gap-1">
        {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
