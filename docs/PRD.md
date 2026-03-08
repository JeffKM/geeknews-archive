# Invoice Web Viewer MVP PRD

| 항목           | 내용                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------- |
| **프로젝트명** | Invoice Web Viewer                                                                                |
| **버전**       | v1.0.0-MVP                                                                                        |
| **작성일**     | 2026-03-08                                                                                        |
| **작성자**     | 1인 개발자 (견적서 작성자)                                                                        |
| **한 줄 요약** | 노션에서 입력한 견적서 데이터를 클라이언트가 고유 URL로 웹에서 확인하고 PDF로 다운로드하는 서비스 |

---

## 1. 문제 정의 (Problem Statement)

### AS-IS: 현재 견적서 발행 프로세스의 문제점

1인 사업자 및 프리랜서가 클라이언트에게 견적서를 전달하는 기존 방식에는 다음과 같은 비효율이 존재한다.

- Word/Excel로 견적서를 수동 작성한 뒤 PDF로 변환하여 이메일로 전송
- 항목 수정이 필요할 때마다 파일을 재작성하고 재전송
- 클라이언트가 파일을 열려면 별도 소프트웨어가 필요하거나, 모바일에서 가독성이 낮음
- 발송 이력 및 견적서 상태(승인/거절) 추적이 어려움
- 버전 관리가 되지 않아 최신 견적서 확인이 어려움

### TO-BE: 이 서비스가 제공하는 해결책

노션(Notion)에 견적서 데이터를 입력하면 시스템이 자동으로 전문적인 웹 견적서를 생성한다. 클라이언트는 별도 소프트웨어 없이 고유 링크(URL) 하나로 브라우저에서 견적서를 확인하고 PDF를 다운로드할 수 있다.

- 노션 데이터 입력 → 자동으로 전문적인 웹 견적서 생성 (ISR 60초 이내 반영)
- 클라이언트에게 링크 하나만 공유하면 즉시 열람 가능
- 견적서 상태(초안/발송/승인/거절)를 노션에서 중앙 관리

### MVP 성공 지표

노션 데이터 입력 → 웹 렌더링 → PDF 다운로드로 이어지는 전체 플로우가 오류 없이 동작한다.

| 지표             | 기준                                     |
| ---------------- | ---------------------------------------- |
| 페이지 로드 시간 | 첫 방문 3초 이내 (노션 API 응답 포함)    |
| ISR 반영 시간    | 노션 데이터 수정 후 60초 이내 웹에 반영  |
| PDF 생성 성공률  | PDF 다운로드 요청의 정상 완료            |
| 에러 처리        | 존재하지 않는 ID 접근 시 커스텀 404 표시 |

---

## 2. 사용자 스토리 (User Stories)

### US-001: 견적서 데이터 입력

**견적서 작성자(나)로서**, 반복적인 Word/Excel 작업을 줄이기 위해, **노션 데이터베이스에 견적서 정보를 입력하는 것만으로 전문적인 견적서를 생성하고 싶다.**

**수용 기준 (Acceptance Criteria)**:

- 노션 Invoices DB에 필수 필드(견적서 번호, 고객사명, 발행일, 유효기간, 상태)가 정의되어 있다
- 노션 Invoice Items DB에 항목 데이터를 입력하면 별도 작업 없이 웹 페이지에 반영된다
- ISR 재검증 주기(60초) 이내에 변경 사항이 웹에 반영된다
- 소계, 부가세, 총액은 노션 Formula 필드로 자동 계산된다

---

### US-002: 클라이언트에게 링크 공유

**견적서 작성자(나)로서**, 이메일 첨부 파일 대신 링크 하나로 견적서를 전달하기 위해, **노션 페이지 ID 기반의 고유 URL을 클라이언트에게 공유하고 싶다.**

**수용 기준 (Acceptance Criteria)**:

- 각 견적서는 `/invoice/[notion-page-id]` 형태의 고유 URL을 가진다
- 해당 URL은 별도 로그인 없이 접근 가능하다
- URL을 공유받은 클라이언트는 즉시 견적서를 열람할 수 있다
- 노션 페이지 ID(UUID)는 128-bit 값으로 추측 기반 무단 접근이 사실상 불가능하다

---

### US-003: 웹 브라우저로 견적서 확인

**클라이언트로서**, 파일 다운로드나 소프트웨어 설치 없이 빠르게 견적서를 검토하기 위해, **링크를 클릭해 브라우저에서 바로 견적서를 확인하고 싶다.**

**수용 기준 (Acceptance Criteria)**:

- 견적서 페이지가 3초 이내에 로드된다
- 데스크톱과 모바일 모두에서 내용을 읽을 수 있다
- 견적서 번호, 발행자 정보, 고객 정보, 항목 목록, 합계가 명확히 표시된다
- 현재 견적서 상태(초안/발송/승인/거절)가 색상 뱃지로 표시된다
- 유효기간이 지난 견적서 접근 시 만료 안내 배너가 표시된다

---

### US-004: PDF 다운로드

**클라이언트로서**, 사내 결재나 보관을 위해, **웹 견적서를 PDF 파일로 다운로드하고 싶다.**

**수용 기준 (Acceptance Criteria)**:

- "PDF 다운로드" 버튼을 클릭하면 PDF 파일이 생성된다
- 파일명은 `견적서_[견적서번호]_[고객사명].pdf` 형식이다
- PDF 레이아웃이 웹 렌더링과 동일하게 유지된다
- 버튼 클릭 후 로딩 상태를 사용자에게 알린다
- PDF 생성 실패 시 sonner 토스트로 오류 메시지를 표시한다

---

### US-005: 견적서 상태 관리

**견적서 작성자(나)로서**, 어떤 견적서가 발송되었고 어떤 상태인지 파악하기 위해, **노션에서 견적서 상태를 관리하고 웹에서도 해당 상태가 반영되길 원한다.**

**수용 기준 (Acceptance Criteria)**:

- 노션 `상태` 필드에서 초안(Draft) / 발송됨(Sent) / 승인(Approved) / 거절(Rejected) 중 하나를 선택할 수 있다
- 노션에서 상태를 변경하면 60초 이내에 웹 뷰어의 상태 뱃지가 갱신된다
- 각 상태는 고유한 색상(회색/파랑/초록/빨강)으로 구분되어 표시된다

---

## 3. 기능 요구사항 (Functional Requirements)

### FR-1: 노션 데이터 연동

노션 API를 통해 견적서 데이터를 읽어오고 도메인 모델로 변환한다.

#### 메인 DB: Invoices

| 분류      | 필드명          | 노션 타입 | 필수 여부 | 설명                                         |
| --------- | --------------- | --------- | --------- | -------------------------------------------- |
| 기본 정보 | 제목            | Title     | 필수      | 견적서 제목 (예: 2026-03 웹사이트 개발 견적) |
| 기본 정보 | 견적서 번호     | Rich Text | 필수      | 고유 번호 (예: INV-2026-001)                 |
| 기본 정보 | 상태            | Select    | 필수      | Draft / Sent / Approved / Rejected           |
| 기본 정보 | 생성일          | Date      | 필수      | 견적서 발행일                                |
| 기본 정보 | 유효기간        | Date      | 필수      | 견적 유효 만료일                             |
| 발행자    | 발행자 회사명   | Rich Text | 필수      | 1인 사업자/프리랜서 회사명                   |
| 발행자    | 발행자 담당자   | Rich Text | 필수      | 담당자 이름                                  |
| 발행자    | 발행자 이메일   | Email     | 필수      | 연락처 이메일                                |
| 발행자    | 발행자 전화번호 | Phone     | 선택      | 연락처 전화번호                              |
| 발행자    | 사업자번호      | Rich Text | 선택      | 000-00-00000 형식                            |
| 고객      | 고객사명        | Rich Text | 필수      | 클라이언트 회사명                            |
| 고객      | 고객 담당자     | Rich Text | 선택      | 클라이언트 담당자 이름                       |
| 고객      | 고객 이메일     | Email     | 선택      | 클라이언트 이메일                            |
| 합계      | 소계            | Number    | 필수      | 부가세 제외 합계 (원)                        |
| 합계      | 부가세          | Formula   | 자동      | `prop("소계") * 0.1` 자동 계산               |
| 합계      | 총액            | Formula   | 자동      | `prop("소계") + prop("부가세")` 자동 계산    |
| 비고      | 결제 조건       | Rich Text | 선택      | 예: 계약 후 50%, 납품 후 50%                 |
| 비고      | 특이사항        | Rich Text | 선택      | 기타 안내 사항                               |
| 연결      | 항목 연결       | Relation  | 필수      | Invoice Items DB 관계형 연결                 |

#### 서브 DB: Invoice Items

| 필드명      | 노션 타입 | 필수 여부 | 설명                                    |
| ----------- | --------- | --------- | --------------------------------------- |
| 항목명      | Title     | 필수      | 작업/서비스 이름                        |
| 수량        | Number    | 필수      | 수량 (기본값: 1)                        |
| 단가        | Number    | 필수      | 단위 금액 (원)                          |
| 금액        | Formula   | 자동      | `prop("수량") * prop("단가")` 자동 계산 |
| 비고        | Rich Text | 선택      | 항목별 추가 설명                        |
| 견적서 연결 | Relation  | 필수      | Invoices DB와 관계형 연결 (역방향)      |
| 정렬 순서   | Number    | 선택      | 항목 표시 순서 (오름차순 정렬)          |

---

### FR-2: 견적서 웹 뷰어

**URL 구조**: `/invoice/[id]` (노션 페이지 UUID 기반)

**견적서 레이아웃 섹션 (순서대로)**:

1. **헤더 섹션**: 견적서 제목, 견적서 번호, 상태 뱃지, 발행일/유효기간
2. **발행자/고객 정보 섹션**: 발행자 정보(좌측) / 고객사 정보(우측) 2단 레이아웃
3. **항목 테이블 섹션**: 번호, 항목명, 수량, 단가, 금액, 비고 컬럼
4. **합계 섹션**: 소계, 부가세(10%), 총액 우측 정렬
5. **하단 안내 섹션**: 결제 조건, 유효기간 안내, 특이사항, PDF 다운로드 버튼

**상태 뱃지 색상**:

| 상태     | 한국어 표시 | 색상   |
| -------- | ----------- | ------ |
| Draft    | 초안        | 회색   |
| Sent     | 발송됨      | 파란색 |
| Approved | 승인        | 초록색 |
| Rejected | 거절        | 빨간색 |

**반응형 대응**:

- 데스크톱: A4 비율(794px 기준) 카드 형태로 중앙 정렬
- 모바일: 전체 너비, 스크롤 가능한 레이아웃

**만료 처리**:

- 유효기간이 지난 견적서 접근 시 견적서 상단에 만료 안내 배너를 표시한다
- 페이지 접근 자체는 차단하지 않는다 (내용 열람은 허용)

---

### FR-3: PDF 다운로드

- PDF 다운로드 버튼(`pdf-download-button.tsx`, Client Component)을 클릭하면 `/api/invoice/[id]/pdf` API Route를 호출한다
- 서버에서 puppeteer로 PDF를 생성하여 파일로 반환한다
- **파일명 형식**: `견적서_[견적서번호]_[고객사명].pdf`
- 버튼 클릭 시 로딩 스피너를 표시하여 사용자에게 진행 상황을 알린다
- PDF 생성 실패 시 sonner 토스트로 오류 메시지를 표시한다
- HTTP 응답 헤더: `Content-Type: application/pdf`, `Content-Disposition: attachment`

---

### FR-4: 에러 처리 및 접근 제어

- **비공개 링크 방식**: 노션 페이지 ID(UUID, 32자리 hex)가 접근 키 역할을 한다. 추측 기반 접근이 사실상 불가능한 UUID 특성으로 최소한의 보안을 확보한다
- **존재하지 않는 ID**: 노션에서 해당 페이지가 없거나 접근 불가능한 경우 커스텀 404 페이지(`not-found.tsx`)를 표시한다
- **노션 API 오류**: `error.tsx` 에러 바운더리로 사용자 친화적인 오류 메시지를 표시한다
- **검색엔진 차단**: 견적서 페이지에 `robots: noindex` 메타태그를 적용하여 검색엔진 인덱싱을 차단한다

---

## 4. 비기능 요구사항 (Non-Functional Requirements)

| 분류      | 요구사항                    | 기준                                                       |
| --------- | --------------------------- | ---------------------------------------------------------- |
| 성능      | 초기 페이지 로드 시간       | 3초 이내 (노션 API 응답 포함)                              |
| 캐싱      | 노션 데이터 ISR 재검증 주기 | 60초 (노션 API rate limit 3req/s 대응)                     |
| 보안      | 노션 API 키 관리            | 서버 전용 환경변수 (NEXT*PUBLIC* 접두사 절대 금지)         |
| 접근성    | 시맨틱 HTML 사용            | `<article>`, `<section>`, `<table>` 등 적절한 태그 사용    |
| 접근성    | 기본 ARIA 레이블            | 버튼, 상태 뱃지에 `aria-label` 적용                        |
| 인쇄      | 인쇄 최적화 CSS             | `@media print` 스타일로 다운로드 버튼/네비게이션 숨김 처리 |
| SEO       | 견적서 페이지 비공개        | `robots: noindex` 메타태그 적용                            |
| 에러 처리 | 노션 API 오류               | 사용자 친화적 오류 메시지 표시                             |
| 에러 처리 | 존재하지 않는 견적서        | 커스텀 404 페이지 렌더링                                   |

---

## 5. 시스템 아키텍처 (MVP)

### 전체 데이터 흐름

```mermaid
graph LR
    A[노션 DB\nInvoices + Items] -->|Notion API\n@notionhq/client| B[Next.js Server\nServer Component]
    B -->|ISR 캐싱\nrevalidate=60초| C[웹 뷰어 페이지\n/invoice/id]
    C -->|브라우저 렌더링| D[클라이언트 브라우저]
    D -->|PDF 다운로드 버튼 클릭| E[PDF 생성 API Route\n/api/invoice/id/pdf]
    E -->|puppeteer\n@sparticuz/chromium| F[PDF 파일 반환\napplication/pdf]
    F --> D
```

### 핵심 데이터 흐름 상세

```
[클라이언트 브라우저]
    ↓ GET /invoice/[id]
[Next.js Server - app/invoice/[id]/page.tsx]
    ↓ getInvoiceById(id)
[lib/notion/invoice.ts]
    ↓ notion.pages.retrieve() + notion.databases.query()
[Notion API] → 응답 캐싱 (ISR 60초)
    ↓ transformNotionToInvoice()
[lib/invoice/transformer.ts]
    ↓ InvoiceData 도메인 모델 반환
[components/invoice/invoice-view.tsx 렌더링]
    → 사용자에게 HTML 반환

[PDF 다운로드 요청]
    ↓ 버튼 클릭 (pdf-download-button.tsx - Client Component)
    ↓ GET /api/invoice/[id]/pdf
[app/api/invoice/[id]/pdf/route.ts]
    ↓ 노션 데이터 재조회 + puppeteer PDF 생성
    ↓ Content-Type: application/pdf
[브라우저 파일 다운로드]
```

### 파일 구조

```
src/
├── app/
│   ├── invoice/
│   │   └── [id]/
│   │       ├── page.tsx          # 견적서 웹 뷰어 (Server Component, ISR revalidate=60)
│   │       ├── not-found.tsx     # 커스텀 404 페이지
│   │       └── error.tsx         # 에러 바운더리
│   ├── api/
│   │   └── invoice/
│   │       └── [id]/
│   │           └── pdf/
│   │               └── route.ts  # PDF 생성 API Route (GET)
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 루트 페이지 (MVP에서 미사용)
│
├── components/
│   └── invoice/
│       ├── invoice-view.tsx          # 견적서 메인 뷰 컴포넌트 (Server Component)
│       ├── invoice-header.tsx        # 헤더: 제목, 번호, 상태, 날짜 (Server Component)
│       ├── invoice-info.tsx          # 발행자/고객 2단 정보 섹션 (Server Component)
│       ├── invoice-items.tsx         # 항목 테이블 (Server Component)
│       ├── invoice-summary.tsx       # 합계 섹션 (Server Component)
│       ├── invoice-footer.tsx        # 하단 안내, 결제 조건, 특이사항 (Server Component)
│       ├── invoice-status-badge.tsx  # 상태 뱃지 컴포넌트 (Server Component)
│       ├── invoice-expired-banner.tsx # 만료 안내 배너 (Server Component)
│       └── pdf-download-button.tsx   # PDF 다운로드 버튼 ("use client")
│
└── lib/
    ├── notion/
    │   ├── client.ts            # Notion API 클라이언트 싱글톤 초기화
    │   ├── invoice.ts           # 견적서 데이터 페칭 함수 (getInvoiceById, getInvoiceItems)
    │   └── types.ts             # Notion API 응답 타입 정의
    └── invoice/
        ├── types.ts             # 견적서 도메인 타입 (InvoiceData, InvoiceItem 등)
        ├── transformer.ts       # Notion 응답 → 도메인 모델 변환 함수
        └── formatters.ts        # 원화/날짜/사업자번호 포맷 유틸리티
```

---

## 6. 도메인 타입 정의 (TypeScript)

개발 시 아래 타입 구조를 기준으로 구현한다.

```typescript
// src/lib/invoice/types.ts

/** 견적서 상태 */
export type InvoiceStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected'

/** 견적 항목 */
export interface InvoiceItem {
  id: string // 노션 페이지 ID
  name: string // 항목명
  quantity: number // 수량
  unitPrice: number // 단가 (원)
  amount: number // 금액 = 수량 × 단가
  note?: string // 비고
  order: number // 정렬 순서
}

/** 견적서 발행자 정보 */
export interface Issuer {
  companyName: string // 회사명
  contactName: string // 담당자명
  email: string // 이메일
  phone?: string // 전화번호
  businessNumber?: string // 사업자번호 (000-00-00000 형식)
}

/** 견적서 고객 정보 */
export interface InvoiceClient {
  companyName: string // 고객사명
  contactName?: string // 담당자명
  email?: string // 이메일
}

/** 견적서 합계 */
export interface InvoiceSummary {
  subtotal: number // 소계 (부가세 제외, 원)
  tax: number // 부가세 = subtotal × 0.1
  total: number // 총액 = subtotal + tax
}

/** 견적서 전체 도메인 모델 */
export interface InvoiceData {
  id: string // 노션 페이지 ID (UUID)
  invoiceNumber: string // 견적서 번호 (예: INV-2026-001)
  title: string // 견적서 제목
  status: InvoiceStatus // 현재 상태
  issuedAt: string // 발행일 (ISO 8601 날짜 문자열)
  expiresAt: string // 유효기간 만료일 (ISO 8601 날짜 문자열)
  issuer: Issuer // 발행자 정보
  client: InvoiceClient // 고객 정보
  items: InvoiceItem[] // 견적 항목 목록 (order 오름차순 정렬)
  summary: InvoiceSummary // 합계 정보
  paymentTerms?: string // 결제 조건
  notes?: string // 특이사항
}

/** API 응답 래퍼 타입 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode: number }
```

---

## 7. 환경변수 명세

```env
# .env.local (로컬 개발 환경)
# 주의: NEXT_PUBLIC_ 접두사는 절대 사용하지 않는다 (클라이언트에 노출 금지)

# 노션 Integration 토큰 (notion.so/my-integrations에서 발급)
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 견적서 메인 데이터베이스 ID (노션 DB URL에서 추출, 32자리 hex)
NOTION_INVOICES_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 견적 항목 데이터베이스 ID (별도 DB)
NOTION_ITEMS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **노션 데이터베이스 ID 추출 방법**: 노션 데이터베이스 페이지 URL `notion.so/[workspace]/[database-id]?v=...` 중 `[database-id]` 부분(하이픈 없는 32자리 hex)을 사용한다.

---

## 8. MVP 범위 정의

### MVP 포함

- 노션 DB 데이터 읽기 및 웹 렌더링 (`/invoice/[id]`, ISR 60초)
- 견적서 상세 페이지 전체 섹션 (헤더, 발행자/고객 정보, 항목 테이블, 합계, 하단 안내)
- 견적서 상태 뱃지 표시 (초안/발송/승인/거절 색상 구분)
- 만료된 견적서 안내 배너
- PDF 다운로드 기능 (`/api/invoice/[id]/pdf`)
- 기본 에러 처리 (커스텀 404, 에러 바운더리)
- 반응형 레이아웃 (데스크톱 A4 카드 형태, 모바일 전체 너비)
- 인쇄 최적화 CSS (`@media print`)
- 검색엔진 인덱싱 차단 (`robots: noindex`)

### MVP 제외 (v2 이후)

- 견적서 작성자 관리 패널 (로그인/인증 불필요)
- 견적서 목록 페이지 (`/invoices`)
- 클라이언트 온라인 승인/거절 (버튼 클릭으로 상태 변경)
- 이메일 자동 발송 (견적서 링크 이메일 발송)
- 견적서 템플릿 커스터마이징
- 결제 연동 (토스페이먼츠 등)
- 다국어 지원 (영문 견적서)
- 견적서 조회 횟수 통계
- 클라이언트 코멘트/메모 기능
- 단기 접근 토큰 기반 URL 보안 강화

---

## 9. 개발 마일스톤

### Phase 1 - 노션 연동 기반 구축 (1주)

- [ ] `@notionhq/client` 설치 및 환경변수 설정
- [ ] 노션 DB 스키마 생성 (Invoices DB + Invoice Items DB + Relation 연결)
- [ ] Notion API 클라이언트 싱글톤 설정 (`src/lib/notion/client.ts`)
- [ ] Notion API 응답 타입 정의 (`src/lib/notion/types.ts`)
- [ ] 견적서 도메인 타입 정의 (`src/lib/invoice/types.ts`)
- [ ] Notion 응답 → 도메인 모델 변환 함수 (`src/lib/invoice/transformer.ts`)
- [ ] 포맷 유틸리티 구현 (`src/lib/invoice/formatters.ts`: 원화, 날짜, 사업자번호)
- [ ] 데이터 페칭 함수 구현 (`src/lib/notion/invoice.ts`: `getInvoiceById`, `getInvoiceItems`)

### Phase 2 - 웹 뷰어 구현 (1주)

- [ ] 견적서 레이아웃 컴포넌트 개발 (6개: invoice-view, header, info, items, summary, footer)
- [ ] 상태 뱃지 컴포넌트 (`invoice-status-badge.tsx`)
- [ ] 만료 안내 배너 컴포넌트 (`invoice-expired-banner.tsx`)
- [ ] `/invoice/[id]` 페이지 구현 (Server Component, ISR `revalidate = 60` 적용)
- [ ] `not-found.tsx` 커스텀 404 페이지
- [ ] `error.tsx` 에러 바운더리
- [ ] 반응형 레이아웃 및 `@media print` 스타일 최적화

### Phase 3 - PDF 다운로드 구현 (3일)

- [ ] `puppeteer` + `@sparticuz/chromium` 설치
- [ ] PDF 생성 API Route 구현 (`src/app/api/invoice/[id]/pdf/route.ts`)
- [ ] PDF 레이아웃과 웹 뷰어 일치 검증
- [ ] PDF 다운로드 버튼 Client Component 구현 (`pdf-download-button.tsx`)
- [ ] 로딩 상태 및 오류 처리 (sonner 토스트)

### Phase 4 - 완성도 및 배포 (2일)

- [ ] 접근성 검토 (시맨틱 HTML, ARIA 레이블)
- [ ] 성능 검토 (Core Web Vitals, 노션 API 응답 시간 측정)
- [ ] Vercel 환경변수 등록 (NOTION_API_KEY, NOTION_INVOICES_DB_ID, NOTION_ITEMS_DB_ID)
- [ ] Vercel 배포 및 프로덕션 동작 확인

---

## 10. 기술적 결정 사항 (Technical Decisions)

| 결정 항목      | 채택 방식                             | 비교 대안                                     | 채택 근거                                                                        |
| -------------- | ------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| PDF 생성       | puppeteer + @sparticuz/chromium       | @react-pdf/renderer, html2canvas              | 웹 뷰어와 동일한 HTML/CSS 레이아웃을 그대로 PDF로 변환하여 레이아웃 일관성 보장  |
| 데이터 캐싱    | ISR (revalidate=60초)                 | SSR (매 요청마다 조회), CSR (클라이언트 페칭) | 노션 API rate limit(3req/s) 대응, 실시간성보다 안정적 읽기 성능 우선             |
| 견적 항목 저장 | 별도 Invoice Items DB (Relation 연결) | 노션 서브아이템, 단일 DB 텍스트 저장          | 항목별 독립 필드 관리, `databases.query()`로 특정 견적서 항목만 필터링 조회 가능 |
| URL 보안       | UUID 기반 비공개 링크                 | JWT 서명 URL, 별도 인증 레이어                | 노션 UUID는 128-bit으로 추측 불가, MVP 구현 복잡도 대비 실질적 보안 위협 낮음    |
| 금액 계산      | 노션 Formula 우선 + Math.round 폴백   | 클라이언트 사이드 계산                        | 원 단위 정밀도 보장, 데이터 소스 일관성 유지                                     |
| PDF 대안 처리  | @react-pdf/renderer (Vercel 이슈 시)  | -                                             | Vercel 서버리스에서 chromium 실행 불가 시 폴백 방안                              |

### PDF 생성 방식 상세 비교

| 방식                  | 장점                                       | 단점                                                                |
| --------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| `puppeteer`           | 웹과 동일한 레이아웃, CSS 완전 지원        | Vercel 서버리스에서 `@sparticuz/chromium` 추가 필요, 번들 크기 증가 |
| `@react-pdf/renderer` | 순수 JS, 서버리스 환경 친화적, 번들 가벼움 | 별도 PDF 전용 레이아웃 컴포넌트 작성 필요, 웹-PDF 이원화            |
| `html2canvas`         | 클라이언트 사이드 처리 가능                | 이미지 기반(텍스트 선택 불가), 품질 저하                            |

### ISR 캐싱 적용 방식

```typescript
// src/app/invoice/[id]/page.tsx
export const revalidate = 60 // 60초마다 백그라운드 재검증

// 동적 파라미터 처리: 빌드 시 알 수 없는 ID를 런타임에 처리
export const dynamicParams = true
```

### 견적 항목 조회 방식

```typescript
// src/lib/notion/invoice.ts - 특정 견적서의 항목만 필터링 조회
const itemsResponse = await notion.databases.query({
  database_id: process.env.NOTION_ITEMS_DB_ID!,
  filter: {
    property: '견적서 연결',
    relation: { contains: invoicePageId },
  },
  sorts: [{ property: '정렬 순서', direction: 'ascending' }],
})
```

---

## 11. 한국 비즈니스 특이사항

### 금액 표기 규칙

```typescript
// src/lib/invoice/formatters.ts

/** 원화 금액 포맷: 1234567 → "1,234,567원" */
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.round(amount)) + '원'
}

/** 부가세 계산 (10%, 원 단위 반올림) */
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.1)
}
```

### 날짜 표기 규칙

```typescript
/** 날짜 포맷: "2026-03-08" → "2026년 3월 8일" */
export function formatKoreanDate(isoDate: string): string {
  const date = new Date(isoDate)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
```

### 사업자번호 포맷

```typescript
/** 사업자번호 포맷: "1234567890" → "123-45-67890" */
export function formatBusinessNumber(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '')
  if (digits.length !== 10) return raw
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
}
```

### 노션 Formula 설정 참고

```
# 노션 부가세 Formula 필드 설정
prop("소계") * 0.1

# 노션 총액 Formula 필드 설정
prop("소계") + prop("부가세")

# 노션 견적 항목 금액 Formula 필드 설정
prop("수량") * prop("단가")
```

---

## 12. 기술 스택

### 프레임워크

- **Next.js 15.5.3** (App Router + Turbopack) - React 풀스택 프레임워크, ISR 지원
- **React 19.1.0** - UI 라이브러리 (Server Components 우선)
- **TypeScript 5** - 타입 안전성 보장 (strict 모드)

### 스타일링 및 UI

- **TailwindCSS v4** - 유틸리티 CSS 프레임워크 (설정 파일 없는 새 엔진)
- **shadcn/ui** (new-york 스타일) - 고품질 React 컴포넌트
- **Lucide React** - 아이콘 라이브러리 (개별 임포트)

### 데이터 소스

- **@notionhq/client** - 노션 공식 API 클라이언트
- **ISR** (Incremental Static Regeneration) - 데이터 캐싱 전략 (revalidate=60)

### PDF 생성

- **puppeteer** - 서버사이드 PDF 생성 (Headless Chrome 렌더링)
- **@sparticuz/chromium** - Vercel 서버리스 환경용 경량 Chromium

### 알림 및 피드백

- **sonner** - 토스트 알림 (PDF 오류 등)

### 배포

- **Vercel** - Next.js 최적화 배포 플랫폼

---

_본 문서는 Invoice Web Viewer MVP 개발을 위한 제품 요구사항 명세서입니다._
_버전 업데이트 시 상단 메타 테이블의 버전과 작성일을 함께 갱신합니다._
