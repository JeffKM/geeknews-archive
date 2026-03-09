import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * 루트 페이지
 * MVP에서는 미사용 - 견적서 목록 페이지 미구현 상태
 * 직접 접근 시 플레이스홀더 안내 표시
 *
 * TODO v2: 견적서 목록 페이지 (/invoices) 구현 후 리다이렉트 또는 대시보드로 교체
 */
export default function RootPage() {
  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-foreground text-2xl font-bold">
          Invoice Web Viewer
        </h1>
        <p className="text-muted-foreground">
          견적서 URL은 발행자로부터 직접 공유받으실 수 있습니다.
        </p>
        <p className="text-muted-foreground/70 text-sm">
          형식: /invoice/[견적서-ID]
        </p>
        <Link href="/invoice/demo">
          <Button variant="outline" size="sm">
            견적서 데모 보기
          </Button>
        </Link>
      </div>
    </main>
  )
}
