import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InvoiceView } from '@/components/invoice/invoice-view'
import { getMockInvoiceById } from '@/lib/invoice/mock-data'

/** 데모 페이지 메타데이터 - 검색 엔진 색인 제외 */
export const metadata: Metadata = {
  title: '견적서 데모',
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * 견적서 데모 페이지 (Server Component)
 * mockSentInvoice 데이터를 사용하여 InvoiceView 컴포넌트를 렌더링합니다.
 */
export default function InvoiceDemoPage() {
  const invoice = getMockInvoiceById('mock-sent-001')

  // 데이터가 없는 경우 404 처리
  if (!invoice) {
    notFound()
  }

  return <InvoiceView invoice={invoice} />
}
