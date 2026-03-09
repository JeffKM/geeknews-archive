import { notion } from '@/lib/notion/client'
import type {
  NotionInvoicePage,
  NotionInvoiceItemPage,
} from '@/lib/notion/types'
import { transformNotionToInvoice } from '@/lib/invoice/transformer'
import type {
  InvoiceData,
  InvoiceListItem,
  InvoiceStatus,
} from '@/lib/invoice/types'

/**
 * 노션 페이지 ID로 견적서 메인 데이터 조회
 * @param pageId 노션 페이지 UUID
 * @throws 페이지가 없거나 접근 불가능한 경우 에러
 */
export async function getInvoicePage(
  pageId: string
): Promise<NotionInvoicePage> {
  const page = await notion.pages.retrieve({ page_id: pageId })
  return page as unknown as NotionInvoicePage
}

/**
 * 특정 견적서에 연결된 항목 목록 조회
 * @notionhq/client v5에서 databases.query가 제거되어 fetch로 직접 호출
 *
 * @param invoicePageId 견적서 노션 페이지 ID
 */
export async function getInvoiceItems(
  invoicePageId: string
): Promise<NotionInvoiceItemPage[]> {
  const dbId = process.env.NOTION_ITEMS_DB_ID!
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: {
        property: 'Invoices',
        relation: { contains: invoicePageId },
      },
    }),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Items DB 조회 실패')
  }

  const data = await res.json()
  return data.results as NotionInvoiceItemPage[]
}

/**
 * Notion Rich Text 배열에서 plain_text 추출 (invoice.ts 내부 헬퍼)
 */
function extractRichText(
  richText: Array<{ plain_text: string }> | undefined
): string {
  if (!richText || richText.length === 0) return ''
  return richText.map(t => t.plain_text).join('')
}

/**
 * NotionInvoicePage를 InvoiceListItem(목록 표시용 경량 모델)으로 변환
 */
function transformNotionToInvoiceListItem(
  page: NotionInvoicePage
): InvoiceListItem {
  const props = page.properties

  // 견적서 번호 (title 타입)
  const titleArray =
    props['견적서 번호']?.type === 'title' ? props['견적서 번호'].title : []
  const invoiceNumber = extractRichText(titleArray)

  // 상태 (status 타입)
  const statusValue =
    props['상태']?.type === 'status' ? props['상태'].status?.name : undefined
  const validStatuses: InvoiceStatus[] = [
    'Draft',
    'Sent',
    'Approved',
    'Rejected',
  ]
  const status: InvoiceStatus =
    statusValue && validStatuses.includes(statusValue as InvoiceStatus)
      ? (statusValue as InvoiceStatus)
      : 'Draft'

  // 고객사명 (rich_text 타입)
  const clientName = extractRichText(
    props['클라이언트명']?.type === 'rich_text'
      ? props['클라이언트명'].rich_text
      : []
  )

  // 발행일 (date 타입)
  const issuedAt =
    props['발행일']?.type === 'date' ? (props['발행일'].date?.start ?? '') : ''

  // 총액 (number 타입)
  const total =
    props['총 금액']?.type === 'number' ? (props['총 금액'].number ?? 0) : 0

  return {
    id: page.id,
    invoiceNumber,
    title: invoiceNumber, // 견적서 번호를 제목으로 사용 (InvoiceData와 동일)
    status,
    clientName,
    issuedAt,
    total,
  }
}

/**
 * 노션 Invoices DB 전체 목록 조회
 * 최신순(생성일 내림차순) 정렬, 최대 100개
 * ISR revalidate=60 적용
 *
 * @returns InvoiceListItem[] 경량 목록 데이터
 */
export async function getAllInvoices(): Promise<InvoiceListItem[]> {
  const dbId = process.env.NOTION_INVOICES_DB_ID!
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 100,
    }),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Invoices DB 조회 실패')
  }

  const data = await res.json()
  return (data.results as NotionInvoicePage[]).map(
    transformNotionToInvoiceListItem
  )
}

/**
 * 견적서 ID로 전체 견적서 데이터 조회 및 도메인 모델 반환
 * 노션 페이지 + 항목 목록을 병렬로 조회 후 변환
 * @param id 노션 페이지 UUID (URL 파라미터)
 * @returns InvoiceData 도메인 모델
 * @throws 페이지 없음, API 오류 등
 */
export async function getInvoiceById(id: string): Promise<InvoiceData> {
  // 견적서 메인 페이지와 항목 목록을 병렬 조회
  const [page, items] = await Promise.all([
    getInvoicePage(id),
    getInvoiceItems(id),
  ])

  // 도메인 모델로 변환
  return transformNotionToInvoice(page, items)
}
