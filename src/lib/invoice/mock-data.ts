import type { InvoiceData } from '@/lib/invoice/types'

/** 공통 발행자 정보 (스튜디오 모션) */
const commonIssuer = {
  companyName: '스튜디오 모션',
  contactName: '김지원',
  email: 'jiwon@studiomotion.kr',
  phone: '010-1234-5678',
  businessNumber: '123-45-67890',
}

/** Draft 상태 견적서 샘플 - 테크스타트 */
export const mockDraftInvoice: InvoiceData = {
  id: 'mock-draft-001',
  invoiceNumber: 'INV-2026-001',
  title: '테크스타트 웹사이트 구축 견적서',
  status: 'Draft',
  issuedAt: '2026-01-15',
  expiresAt: '2026-04-15',
  issuer: commonIssuer,
  client: {
    companyName: '테크스타트',
    contactName: '이민준',
    email: 'minjun@techstart.kr',
  },
  items: [
    {
      id: 'item-draft-001',
      name: '웹사이트 기획 및 디자인',
      quantity: 1,
      unitPrice: 2500000,
      amount: 2500000,
      note: '와이어프레임, UI/UX 디자인 포함',
      order: 1,
    },
    {
      id: 'item-draft-002',
      name: '프론트엔드 개발',
      quantity: 1,
      unitPrice: 4000000,
      amount: 4000000,
      note: 'React 기반 반응형 웹 개발',
      order: 2,
    },
    {
      id: 'item-draft-003',
      name: '백엔드 API 개발',
      quantity: 1,
      unitPrice: 3500000,
      amount: 3500000,
      note: 'REST API 서버 구축',
      order: 3,
    },
  ],
  summary: {
    subtotal: 10000000,
    tax: 1000000,
    total: 11000000,
  },
  paymentTerms: '계약금 50%, 중도금 30%, 잔금 20% (납품 완료 후)',
  notes: '초안 상태입니다. 최종 확정 전 내용이 변경될 수 있습니다.',
}

/** Sent 상태 견적서 샘플 - 그린소프트 */
export const mockSentInvoice: InvoiceData = {
  id: 'mock-sent-001',
  invoiceNumber: 'INV-2026-002',
  title: '그린소프트 ERP 시스템 개발 견적서',
  status: 'Sent',
  issuedAt: '2026-01-15',
  expiresAt: '2026-04-15',
  issuer: commonIssuer,
  client: {
    companyName: '그린소프트',
    contactName: '박서연',
    email: 'seoyeon@greensoft.co.kr',
  },
  items: [
    {
      id: 'item-sent-001',
      name: 'ERP 시스템 설계',
      quantity: 1,
      unitPrice: 5000000,
      amount: 5000000,
      note: '요구사항 분석 및 시스템 설계 문서 포함',
      order: 1,
    },
    {
      id: 'item-sent-002',
      name: '사용자 인터페이스 개발',
      quantity: 1,
      unitPrice: 6000000,
      amount: 6000000,
      note: '대시보드, 재고 관리, 매출 분석 화면',
      order: 2,
    },
    {
      id: 'item-sent-003',
      name: '데이터베이스 설계 및 마이그레이션',
      quantity: 1,
      unitPrice: 2000000,
      amount: 2000000,
      note: '기존 데이터 이관 포함',
      order: 3,
    },
  ],
  summary: {
    subtotal: 13000000,
    tax: 1300000,
    total: 14300000,
  },
  paymentTerms: '계약금 40%, 완료 후 잔금 60%',
  notes:
    '견적서 검토 후 문의사항은 jiwon@studiomotion.kr 로 연락 부탁드립니다.',
}

/** Approved 상태 견적서 샘플 - 블루커머스 */
export const mockApprovedInvoice: InvoiceData = {
  id: 'mock-approved-001',
  invoiceNumber: 'INV-2026-003',
  title: '블루커머스 쇼핑몰 리뉴얼 견적서',
  status: 'Approved',
  issuedAt: '2026-01-15',
  expiresAt: '2026-04-15',
  issuer: commonIssuer,
  client: {
    companyName: '블루커머스',
    contactName: '최현우',
    email: 'hyunwoo@bluecommerce.kr',
  },
  items: [
    {
      id: 'item-approved-001',
      name: 'UX 리서치 및 UI 디자인',
      quantity: 1,
      unitPrice: 3500000,
      amount: 3500000,
      note: '사용자 조사, 프로토타입, 디자인 시스템',
      order: 1,
    },
    {
      id: 'item-approved-002',
      name: '쇼핑몰 프론트엔드 개발',
      quantity: 1,
      unitPrice: 5500000,
      amount: 5500000,
      note: 'Next.js 기반 SSR 쇼핑몰 개발',
      order: 2,
    },
  ],
  summary: {
    subtotal: 9000000,
    tax: 900000,
    total: 9900000,
  },
  paymentTerms: '선금 50%, 납품 후 50%',
  notes: '승인 완료. 2026년 2월 착수 예정입니다.',
}

/** Rejected 상태 견적서 샘플 - 레드파트너스 */
export const mockRejectedInvoice: InvoiceData = {
  id: 'mock-rejected-001',
  invoiceNumber: 'INV-2026-004',
  title: '레드파트너스 모바일 앱 개발 견적서',
  status: 'Rejected',
  issuedAt: '2026-01-15',
  expiresAt: '2026-04-15',
  issuer: commonIssuer,
  client: {
    companyName: '레드파트너스',
    contactName: '정다은',
    email: 'daeun@redpartners.co.kr',
  },
  items: [
    {
      id: 'item-rejected-001',
      name: '모바일 앱 UX 디자인',
      quantity: 1,
      unitPrice: 4000000,
      amount: 4000000,
      note: 'iOS / Android 통합 디자인',
      order: 1,
    },
    {
      id: 'item-rejected-002',
      name: 'React Native 앱 개발',
      quantity: 1,
      unitPrice: 8000000,
      amount: 8000000,
      note: '크로스 플랫폼 앱 개발',
      order: 2,
    },
    {
      id: 'item-rejected-003',
      name: '앱스토어 배포 지원',
      quantity: 1,
      unitPrice: 500000,
      amount: 500000,
      note: 'App Store, Google Play 등록 지원',
      order: 3,
    },
  ],
  summary: {
    subtotal: 12500000,
    tax: 1250000,
    total: 13750000,
  },
  paymentTerms: '계약금 30%, 중도금 40%, 잔금 30%',
  notes: '예산 초과로 반려 처리되었습니다.',
}

/** 만료된 Sent 상태 견적서 샘플 - 옐로우스튜디오 */
export const mockExpiredInvoice: InvoiceData = {
  id: 'mock-expired-001',
  invoiceNumber: 'INV-2024-010',
  title: '옐로우스튜디오 브랜드 사이트 견적서',
  status: 'Sent',
  issuedAt: '2026-01-15',
  expiresAt: '2024-01-01',
  issuer: commonIssuer,
  client: {
    companyName: '옐로우스튜디오',
    contactName: '강민서',
    email: 'minseo@yellowstudio.kr',
  },
  items: [
    {
      id: 'item-expired-001',
      name: '브랜드 아이덴티티 디자인',
      quantity: 1,
      unitPrice: 3000000,
      amount: 3000000,
      note: '로고, 컬러 팔레트, 타이포그래피',
      order: 1,
    },
    {
      id: 'item-expired-002',
      name: '브랜드 웹사이트 개발',
      quantity: 1,
      unitPrice: 4500000,
      amount: 4500000,
      note: '랜딩 페이지 및 포트폴리오 섹션',
      order: 2,
    },
    {
      id: 'item-expired-003',
      name: '6개월 유지보수',
      quantity: 6,
      unitPrice: 200000,
      amount: 1200000,
      note: '월 1회 정기 점검 및 콘텐츠 업데이트',
      order: 3,
    },
  ],
  summary: {
    subtotal: 8700000,
    tax: 870000,
    total: 9570000,
  },
  paymentTerms: '선금 100% (유효기간 내 계약 시)',
  notes: '유효기간이 만료된 견적서입니다. 재견적이 필요하시면 연락 주세요.',
}

/** 전체 목 견적서 배열 */
export const MOCK_INVOICES: InvoiceData[] = [
  mockDraftInvoice,
  mockSentInvoice,
  mockApprovedInvoice,
  mockRejectedInvoice,
  mockExpiredInvoice,
]

/**
 * ID로 목 견적서 조회
 * @param id 견적서 ID
 * @returns 해당 ID의 견적서 또는 null
 */
export function getMockInvoiceById(id: string): InvoiceData | null {
  return MOCK_INVOICES.find(invoice => invoice.id === id) ?? null
}
