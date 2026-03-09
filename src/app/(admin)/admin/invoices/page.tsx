import type { Metadata } from 'next'
import { getAllInvoices } from '@/lib/notion/invoice'
import { InvoiceListTable } from '@/components/admin/invoice-list-table'
import { logger } from '@/lib/logger'

export const metadata: Metadata = {
  title: '견적서 목록',
}

/** ISR: 60초마다 백그라운드 재검증 */
export const revalidate = 60

/**
 * 관리자 견적서 목록 페이지 (Server Component)
 * 노션 DB에서 모든 견적서 목록 조회 후 테이블 렌더링
 */
export default async function AdminInvoicesPage() {
  let invoices = []

  try {
    invoices = await getAllInvoices()
  } catch (error) {
    logger.error('견적서 목록 조회 오류', error, 'admin/invoices')
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">견적서 목록</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950">
          <p className="text-red-700 dark:text-red-300">
            견적서 목록을 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            노션 API 연결을 확인해주세요.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">견적서 목록</h1>
        <p className="text-muted-foreground text-sm">총 {invoices.length}건</p>
      </div>
      <InvoiceListTable invoices={invoices} />
    </div>
  )
}
