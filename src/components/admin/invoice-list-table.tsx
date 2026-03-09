import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { InvoiceListItem } from '@/lib/invoice/types'
import { formatKRW, formatKoreanDate } from '@/lib/invoice/formatters'
import { InvoiceStatusBadge } from '@/components/invoice/invoice-status-badge'
import { CopyLinkButton } from '@/components/admin/copy-link-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface InvoiceListTableProps {
  invoices: InvoiceListItem[]
}

/**
 * 견적서 목록 테이블 컴포넌트 (Server Component)
 * 빈 상태 UI 포함, 모바일 수평 스크롤
 */
export function InvoiceListTable({ invoices }: InvoiceListTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <FileText
          className="text-muted-foreground mb-4 h-12 w-12"
          aria-hidden="true"
        />
        <h2 className="text-muted-foreground mb-2 text-lg font-medium">
          등록된 견적서가 없습니다
        </h2>
        <p className="text-muted-foreground text-sm">
          노션 데이터베이스에 견적서를 추가하면 여기에 표시됩니다.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">견적서 번호</TableHead>
            <TableHead className="min-w-[140px]">고객사명</TableHead>
            <TableHead className="min-w-[90px]">상태</TableHead>
            <TableHead className="min-w-[110px]">발행일</TableHead>
            <TableHead className="min-w-[120px] text-right">총액</TableHead>
            <TableHead className="min-w-[80px] text-center">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(invoice => (
            <TableRow key={invoice.id}>
              {/* 견적서 번호 (링크) */}
              <TableCell className="font-medium">
                <Link
                  href={`/invoice/${invoice.id}`}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {invoice.invoiceNumber || '-'}
                </Link>
              </TableCell>

              {/* 고객사명 */}
              <TableCell>{invoice.clientName || '-'}</TableCell>

              {/* 상태 뱃지 */}
              <TableCell>
                <InvoiceStatusBadge status={invoice.status} />
              </TableCell>

              {/* 발행일 */}
              <TableCell className="text-muted-foreground text-sm">
                {invoice.issuedAt ? formatKoreanDate(invoice.issuedAt) : '-'}
              </TableCell>

              {/* 총액 */}
              <TableCell className="text-right font-medium">
                {formatKRW(invoice.total)}
              </TableCell>

              {/* 액션: 링크 복사 버튼 */}
              <TableCell className="text-center">
                <CopyLinkButton invoiceId={invoice.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
