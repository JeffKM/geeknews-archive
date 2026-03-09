# Invoice Web Viewer 개발 로드맵

노션에서 입력한 견적서 데이터를 클라이언트가 고유 URL로 웹에서 확인하고 PDF로 다운로드하는 서비스

## 개요

Invoice Web Viewer는 1인 사업자 및 프리랜서를 위한 견적서 웹 뷰어로 다음 기능을 제공합니다:

- **노션 데이터 연동**: 노션 데이터베이스에 입력한 견적서 정보를 자동으로 웹 페이지에 반영 (ISR 60초)
- **견적서 웹 뷰어**: 고유 URL(`/invoice/[id]`)로 별도 로그인 없이 브라우저에서 즉시 열람
- **PDF 다운로드**: 웹 렌더링과 동일한 레이아웃의 PDF 파일 생성 및 다운로드
- **상태 관리**: 초안/발송/승인/거절 상태를 색상 뱃지로 시각화
- **관리자 대시보드**: 견적서 목록 조회 및 클라이언트 공유 링크 관리
- **다크 모드**: 전체 페이지 다크/라이트 테마 전환

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **각 구현 단계는 다음 사이클을 반복:**
     1. 코드 구현
     2. Playwright MCP로 테스트 수행 (API 응답 검증, 에러 시나리오, 경계값)
     3. 테스트 결과 검증 및 확인
     4. 실패 시 -> 재구현 후 재테스트 (통과할 때까지 반복)
     5. 통과 시 -> 다음 단계로 진행
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료 표시로 갱신

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

- **Task 001: 프로젝트 구조 및 라우팅 설정** ✅ - 완료
  - See: `/tasks/001-project-structure.md`
  - ✅ Next.js App Router 기반 전체 라우트 구조 생성 (`/invoice/[id]`, `/api/invoice/[id]/pdf`)
  - ✅ 루트 레이아웃 (`layout.tsx`) - ThemeProvider, Toaster, Geist 폰트 설정
  - ✅ 루트 페이지 (`page.tsx`) - 플레이스홀더 안내 페이지
  - ✅ 견적서 페이지 구조 (`page.tsx`, `not-found.tsx`, `error.tsx`)
  - ✅ PDF API Route 플레이스홀더 (`route.ts` - 501 응답)

- **Task 002: 타입 정의 및 인터페이스 설계** ✅ - 완료
  - See: `/tasks/002-type-definitions.md`
  - ✅ 도메인 모델 타입 정의 (`src/lib/invoice/types.ts`) - InvoiceData, InvoiceItem, Issuer, InvoiceClient, InvoiceSummary, InvoiceStatus, ApiResponse
  - ✅ 노션 API 응답 타입 정의 (`src/lib/notion/types.ts`) - NotionInvoicePage, NotionInvoiceItemPage, 모든 Notion 속성 타입
  - ✅ 환경변수 검증 스키마 (`src/lib/env.ts`) - Zod를 사용한 NOTION_API_KEY, NOTION_INVOICES_DB_ID, NOTION_ITEMS_DB_ID 검증

### Phase 2: UI/UX 완성 ✅

- **Task 003: 견적서 UI 컴포넌트 라이브러리 구현** ✅ - 완료
  - See: `/tasks/003-component-library.md`
  - ✅ `invoice-view.tsx` - 메인 뷰 컴포넌트 (데스크톱 A4 794px 카드, 모바일 전체 너비)
  - ✅ `invoice-header.tsx` - 제목, 번호, 상태 뱃지, 발행일/유효기간
  - ✅ `invoice-info.tsx` - 발행자/고객 정보 2단 레이아웃
  - ✅ `invoice-items.tsx` - 항목 테이블 (번호, 항목명, 수량, 단가, 금액, 비고)
  - ✅ `invoice-summary.tsx` - 소계, 부가세(10%), 총액 우측 정렬
  - ✅ `invoice-footer.tsx` - 결제 조건, 유효기간 안내, 특이사항, PDF 다운로드 버튼
  - ✅ `invoice-status-badge.tsx` - 상태별 색상 뱃지 (Draft=회색, Sent=파랑, Approved=초록, Rejected=빨강)
  - ✅ `invoice-expired-banner.tsx` - 만료 안내 배너 (amber 색상, AlertTriangle 아이콘)
  - ✅ `pdf-download-button.tsx` - Client Component, 로딩 상태, sonner 토스트 오류 처리

- **Task 004: 견적서 페이지 통합 및 반응형 디자인** ✅ - 완료
  - See: `/tasks/004-page-integration.md`
  - ✅ 견적서 페이지 (`/invoice/[id]`) Server Component로 모든 UI 컴포넌트 통합
  - ✅ ISR 설정 (revalidate=60)
  - ✅ 메타데이터 생성 (robots: noindex)
  - ✅ 에러 처리 - notFound() 호출 및 error.tsx 에러 바운더리
  - ✅ 커스텀 404 페이지 (FileSearch 아이콘, 안내 메시지)
  - ✅ 반응형 디자인 - 데스크톱 A4 카드 / 모바일 전체 너비
  - ✅ 인쇄 스타일 최적화 (print:bg-white, print:shadow-none, print:hidden)
  - ✅ 더미 데이터 모듈 (`src/lib/invoice/mock-data.ts`) - 5가지 상태별 샘플 InvoiceData
  - ✅ 견적서 데모 페이지 (`/invoice/demo`) - Notion API 없이 UI 확인 가능

### Phase 3: 핵심 기능 구현 ✅

- **Task 005: 노션 데이터 연동 및 변환 로직** ✅ - 완료
  - See: `/tasks/005-notion-integration.md`
  - ✅ Notion API 클라이언트 싱글톤 (`src/lib/notion/client.ts`)
  - ✅ 견적서 데이터 조회 함수 (`src/lib/notion/invoice.ts`) - getInvoicePage, getInvoiceItems, getInvoiceById (Promise.all 병렬 조회)
  - ✅ 데이터 변환 로직 (`src/lib/invoice/transformer.ts`) - 노션 속성 추출, InvoiceStatus 변환, 항목 변환 및 정렬, 합계 계산
  - ✅ 포맷 유틸리티 (`src/lib/invoice/formatters.ts`) - formatKRW, calculateTax, formatKoreanDate, formatBusinessNumber, isExpired

- **Task 006: PDF 생성 API 구현** ✅ - 완료
  - See: `/tasks/006-pdf-api.md`
  - ✅ puppeteer-core + @sparticuz/chromium 설치 및 next.config.ts serverExternalPackages 설정
  - ✅ `src/lib/pdf/generator.ts` - 로컬(시스템 Chrome)/Vercel(@sparticuz/chromium) 환경 분기
  - ✅ `/api/invoice/[id]/pdf` 실제 PDF 생성 구현 (200/404/500 에러 처리)
  - ✅ 파일명 RFC 5987 인코딩 (`견적서_[번호]_[고객사명].pdf`)

- **Task 006-1: 노션 연동 통합 테스트** ✅ - 완료
  - See: `/tasks/006-1-integration-test.md`
  - ✅ Playwright MCP를 사용한 견적서 전체 플로우 E2E 테스트
  - ✅ 정상 시나리오: 정상 견적서 페이지 로드 및 모든 섹션 표시 검증
  - ✅ 에러 시나리오: 존재하지 않는 ID 접근 시 에러 바운더리 동작 확인
  - ✅ 엣지 케이스: 상태별 뱃지 색상, 모바일/데스크톱 반응형 레이아웃 검증
  - ✅ 테스트 중 발견된 UI 개선 사항 반영 후 재테스트 완료

### Phase 4: 배포 및 최적화 ✅

- **Task 007: 환경변수 설정 및 Vercel 배포** ✅ - 완료
  - See: `/tasks/007-vercel-deployment.md`
  - ✅ `.env.local` 환경변수 가이드 문서화
  - ✅ Vercel 프로젝트 환경변수 설정 및 최초 배포
  - ✅ 배포 환경에서 노션 API 연동, ISR 재검증, PDF 생성 동작 확인
  - ✅ CVE-2025-55182 보안 패치 (Next.js 15.5.12, React 19.1.5)

- **Task 008: 성능 최적화 및 품질 개선** ✅ - 완료
  - See: `/tasks/008-optimization.md`
  - ✅ 페이지 로드 성능 최적화 (빌드 번들 최적화, compress/WebP/AVIF 적용 확인)
  - ✅ 접근성(a11y) 검증 및 개선 (`invoice-items.tsx` table th에 `scope="col"` 추가)
  - ✅ SEO 메타태그 최종 점검 (`robots: noindex, nofollow` 확인)
  - ✅ 다크 모드 견적서 렌더링 검증 (Playwright MCP로 전체 섹션 스크린샷 확인)
  - ✅ 에러 모니터링 체계 구축 (`src/lib/logger.ts` 구조화된 로거 생성)

### Phase 5: 고도화 - 관리자 대시보드 및 UX 개선 ✅

- **Task 009: 관리자 라우트 골격 및 레이아웃 구축** ✅ - 완료
  - Next.js Route Group `(admin)` 생성 및 관리자 전용 레이아웃 구현
  - 관리자 레이아웃 컴포넌트: 사이드바(또는 상단 내비게이션), 헤더, 메인 콘텐츠 영역
  - 관리자 페이지 라우트 구조 생성: `/admin` (대시보드), `/admin/invoices` (견적서 목록)
  - 관리자 네비게이션 (`src/components/admin/admin-nav.tsx`) 구현 - 구체적 메뉴 항목:
    - 대시보드 홈: `/admin`
    - 견적서 목록: `/admin/invoices`
  - 다크 모드 토글 버튼을 관리자 레이아웃 헤더에 배치 (기존 `ThemeToggle` 컴포넌트 활용)
  - 관리자 전용 타입 정의: `InvoiceListItem` (목록 표시용 경량 타입)

- **Task 009-1: 관리자 인증 시스템 구현** ✅ - 완료
  - 환경변수 기반 패스워드 인증 (`ADMIN_PASSWORD` 환경변수 추가)
  - 쿠키 기반 세션 유틸리티 구현 (`src/lib/auth.ts`)
    - `validatePassword(password: string): boolean` - 환경변수와 입력값 비교
    - `setSessionCookie(response: NextResponse): void` - 세션 쿠키 설정
    - `getSession(request: NextRequest): boolean` - 세션 쿠키 유효성 검증
    - `clearSession(response: NextResponse): void` - 세션 쿠키 삭제
  - Next.js `middleware.ts` 구현 (프로젝트 루트)
    - `/admin/**` 경로에서 세션 쿠키 검증
    - 미인증 시 `/admin/login?callbackUrl=...`으로 리다이렉트
    - `/admin/login` 자체는 보호 제외
  - 로그인 페이지 구현
    - `src/app/(admin)/admin/login/page.tsx` (Server Component)
    - `src/components/admin/login-form.tsx` (Client Component + Server Action 연동)
    - `src/app/actions/auth.ts` (Server Action: 로그인/로그아웃)
    - 로그인 성공 → callbackUrl 또는 `/admin/invoices`로 리다이렉트
    - 로그인 실패 → 에러 메시지 표시
  - **[테스트 필수 시나리오 - Playwright MCP]**
    - 정상 케이스: 올바른 패스워드 입력 → 로그인 성공 → `/admin/invoices` 리다이렉트
    - 에러 케이스: 잘못된 패스워드 입력 → 에러 메시지 표시
    - 보호 케이스: 미인증 상태로 `/admin/invoices` 접근 → `/admin/login`으로 리다이렉트

- **Task 010: 견적서 목록 API 구현** ✅ - 완료
  - 노션 Invoices DB 전체 목록 조회 함수 구현 (`src/lib/notion/invoice.ts`에 `getAllInvoices` 추가)
  - 노션 `databases.query` 대신 fetch 직접 호출 (기존 `getInvoiceItems` 패턴 재사용)
  - 목록 조회 시 필수 필드만 추출: 견적서 번호, 제목, 상태, 고객사명, 발행일, 총액
  - 정렬: 생성일 기준 내림차순 (최신순)
  - ISR 캐싱 적용 (revalidate=60)
  - **[테스트 필수 시나리오 - Playwright MCP]**
    - 정상 케이스: API 호출 후 목록 데이터 반환 검증, 각 필드 정상 매핑 확인
    - 에러 케이스: 노션 API 키 누락/잘못된 DB ID 시 에러 처리 확인
    - 경계값 케이스: 빈 DB(항목 0개), 대량 데이터(100개 이상) 페이지네이션 처리

- **Task 011: 견적서 목록 페이지 UI 구현** ✅ - 완료
  - `/admin/invoices` 페이지에 견적서 목록 테이블 UI 구현 (Server Component)
  - 테이블 컬럼: 견적서 번호, 제목, 고객사명, 상태 뱃지, 발행일, 총액, 액션(링크 복사)
  - shadcn/ui `Table` 컴포넌트 활용
  - 빈 상태(Empty State) UI: 등록된 견적서가 없을 때 안내 메시지
  - 반응형 디자인: 모바일에서는 카드 형태로 전환 또는 수평 스크롤
  - 기존 `invoice-status-badge.tsx` 컴포넌트 재사용

- **Task 012: 클라이언트 공유 링크 복사 기능 구현** ✅ - 완료
  - 견적서 목록의 각 행에 "링크 복사" 버튼 추가 (Client Component)
  - `navigator.clipboard.writeText()`로 `/invoice/[id]` 전체 URL 복사
  - 복사 성공 시 sonner 토스트 알림 ("링크가 클립보드에 복사되었습니다")
  - 복사 실패 시 폴백 처리 (구형 브라우저 `document.execCommand('copy')` 폴백)
  - 복사 버튼 아이콘: Lucide `Copy` / 복사 완료: `Check` 아이콘 (1.5초 후 원래 아이콘 복원)
  - **[테스트 필수 시나리오 - Playwright MCP]**
    - 정상 케이스: 링크 복사 버튼 클릭 후 토스트 표시 확인
    - 정상 케이스: 복사된 URL 형식이 `/invoice/[valid-id]` 패턴인지 검증
    - 에러 케이스: clipboard API 미지원 환경에서의 폴백 동작 확인

- **Task 013: 다크 모드 UI 전체 적용 및 토글 배치** ✅ - 완료
  - 견적서 뷰어 페이지(`/invoice/[id]`)에 다크 모드 토글 버튼 배치 (페이지 우측 상단)
  - 견적서 뷰어 다크 모드 스타일 정밀 검증 및 조정
    - 테이블 border, 배경색, 텍스트 대비(WCAG AA 기준)
    - 상태 뱃지 다크 모드 색상 가시성 확인
    - 만료 배너 다크 모드 스타일 확인
    - 하단 안내 섹션 배경 및 텍스트 색상
  - 관리자 페이지 다크 모드 스타일 검증 (레이아웃, 테이블, 카드)
  - 인쇄 시 다크 모드 비활성화 (print 미디어 쿼리에서 항상 라이트 모드)
  - PDF 생성 시 다크 모드 영향 차단 (puppeteer에서 prefers-color-scheme: light 강제)
  - **[테스트 필수 시나리오 - Playwright MCP]**
    - 정상 케이스: 라이트/다크 모드 전환 시 견적서 뷰어 전체 섹션 스크린샷 비교
    - 정상 케이스: 관리자 페이지 다크 모드 렌더링 확인
    - 정상 케이스: 테마 토글 클릭 시 즉시 테마 변경 확인
    - 에러 케이스: 다크 모드에서 PDF 다운로드 시 라이트 모드 PDF 생성 확인
    - 엣지 케이스: 시스템 테마 변경 시 자동 반영 확인

- **Task 013-1: 고도화 통합 테스트** ✅ - 완료
  - Playwright MCP를 사용한 관리자 페이지 전체 플로우 E2E 테스트
  - 정상 시나리오: 관리자 페이지 접근 -> 견적서 목록 조회 -> 링크 복사 -> 견적서 뷰어 열람 전체 플로우
  - 에러 시나리오: 노션 API 오류 시 관리자 페이지 에러 처리 검증
  - 다크 모드 시나리오: 관리자 페이지와 견적서 뷰어 간 테마 일관성 검증
  - 반응형 시나리오: 모바일(375px)/태블릿(768px)/데스크톱(1280px) 레이아웃 검증
  - 테스트 실패 항목 재구현 후 재테스트 완료 확인

## 기술 스택 요약

| 영역        | 기술                                                   |
| ----------- | ------------------------------------------------------ |
| Framework   | Next.js 15.5.12 (App Router + Turbopack), React 19.1.5 |
| Language    | TypeScript 5 (strict)                                  |
| Styling     | TailwindCSS v4, shadcn/ui (new-york), Lucide React     |
| Data Source | @notionhq/client, ISR (revalidate=60)                  |
| PDF         | puppeteer + @sparticuz/chromium                        |
| Validation  | Zod                                                    |
| Toast       | sonner                                                 |
| Theme       | next-themes                                            |
| Auth        | 환경변수 패스워드 + 쿠키 세션 (middleware.ts)          |
| Deploy      | Vercel                                                 |

## 파일 구조

```
src/
├── app/
│   ├── (admin)/                    # [Phase 5] 관리자 Route Group
│   │   ├── layout.tsx              # 관리자 전용 레이아웃 (사이드바/헤더)
│   │   └── admin/
│   │       ├── page.tsx            # 관리자 대시보드 (견적서 목록으로 리다이렉트)
│   │       ├── login/
│   │       │   └── page.tsx        # 로그인 페이지 (Server Component)
│   │       └── invoices/
│   │           └── page.tsx        # 견적서 목록 페이지 (Server Component)
│   ├── actions/
│   │   └── auth.ts                 # 인증 Server Action (로그인/로그아웃)
│   ├── invoice/
│   │   ├── [id]/
│   │   │   ├── page.tsx            # 견적서 웹 뷰어 (Server Component, ISR revalidate=60)
│   │   │   ├── not-found.tsx       # 커스텀 404 페이지
│   │   │   └── error.tsx           # 에러 바운더리
│   │   └── demo/
│   │       └── page.tsx            # 더미 데이터 기반 데모 페이지 (/invoice/demo)
│   ├── api/invoice/[id]/pdf/
│   │   └── route.ts                # PDF 생성 API Route
│   ├── layout.tsx                  # 루트 레이아웃 (ThemeProvider + Toaster)
│   └── page.tsx                    # 루트 페이지 (플레이스홀더)
├── components/
│   ├── admin/                      # [Phase 5] 관리자 전용 컴포넌트
│   │   ├── admin-layout.tsx        # 관리자 레이아웃 (헤더 + 사이드바)
│   │   ├── admin-nav.tsx           # 관리자 네비게이션 메뉴 (/admin, /admin/invoices)
│   │   ├── login-form.tsx          # 로그인 폼 컴포넌트 ("use client")
│   │   ├── invoice-list-table.tsx  # 견적서 목록 테이블
│   │   └── copy-link-button.tsx    # 클라이언트 공유 링크 복사 버튼 ("use client")
│   ├── invoice/
│   │   ├── invoice-view.tsx        # 메인 뷰 컴포넌트 (Server Component)
│   │   ├── invoice-header.tsx      # 헤더: 제목, 번호, 상태, 날짜
│   │   ├── invoice-info.tsx        # 발행자/고객 정보 2단 레이아웃
│   │   ├── invoice-items.tsx       # 항목 테이블
│   │   ├── invoice-summary.tsx     # 합계 섹션 (소계/부가세/총액)
│   │   ├── invoice-footer.tsx      # 하단 안내 (결제조건/특이사항/PDF)
│   │   ├── invoice-status-badge.tsx  # 상태별 색상 뱃지
│   │   ├── invoice-expired-banner.tsx # 만료 안내 배너
│   │   └── pdf-download-button.tsx # PDF 다운로드 버튼 ("use client")
│   ├── providers/
│   │   └── theme-provider.tsx      # next-themes ThemeProvider
│   ├── theme-toggle.tsx            # 다크 모드 토글 버튼
│   └── ui/                         # shadcn/ui 컴포넌트
└── lib/
    ├── notion/
    │   ├── client.ts               # Notion API 클라이언트 싱글톤
    │   ├── invoice.ts              # 견적서 데이터 조회 함수 (getInvoiceById, getAllInvoices)
    │   └── types.ts                # Notion API 응답 타입 정의
    ├── invoice/
    │   ├── types.ts                # 도메인 모델 타입 (InvoiceData, InvoiceListItem 등)
    │   ├── transformer.ts          # Notion -> 도메인 모델 변환
    │   ├── formatters.ts           # 포맷 유틸리티 (KRW, 날짜, 사업자번호)
    │   └── mock-data.ts            # 더미 데이터 (개발/테스트용, 5가지 상태 샘플)
    ├── pdf/
    │   └── generator.ts            # PDF 생성 로직 (puppeteer + chromium)
    ├── auth.ts                     # 세션 관리 유틸리티 (쿠키 기반)
    ├── logger.ts                   # 구조화된 로거
    └── env.ts                      # 환경변수 검증 (Zod)
middleware.ts                       # 보호된 라우트 미들웨어 (admin/** 경로 보호)
```

---

**최종 업데이트**: 2026-03-09
**진행 상황**: Phase 1~5 완료 (16/16 Tasks 완료, MVP 100% | 고도화 100%)
