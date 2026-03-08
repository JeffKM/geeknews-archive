# Invoice Web Viewer 프로젝트 메모리

## 프로젝트 개요

- 노션 DB → 웹 견적서 뷰어 + PDF 다운로드
- URL: /invoice/[notion-page-uuid]
- ISR revalidate=60초

## 주요 아키텍처 결정

### @notionhq/client API 변경사항 (중요)

- 최신 버전에서 `databases.query` 메서드가 제거됨
- 대신 `dataSources.query` 사용 (parameter: `data_source_id`)
- PRD에는 `databases.query`로 작성되어 있으나 실제 구현은 `dataSources.query` 사용

### 파일 구조

- `src/lib/invoice/` - 도메인 타입, 포맷터, 트랜스포머
- `src/lib/notion/` - API 클라이언트, 노션 타입, 데이터 페칭
- `src/components/invoice/` - 견적서 UI 컴포넌트 8개
- `src/app/invoice/[id]/` - 견적서 페이지 (page, not-found, error)
- `src/app/api/invoice/[id]/pdf/` - PDF API Route (Phase 3 미구현)

## 알려진 기술 부채

- PDF 생성 미구현 (Phase 3 예정): puppeteer + @sparticuz/chromium
- Vercel 서버리스 환경에서 chromium 이슈 시 @react-pdf/renderer 폴백 검토

## 환경변수

- NOTION*API_KEY (서버 전용, NEXT_PUBLIC* 절대 금지)
- NOTION_INVOICES_DB_ID
- NOTION_ITEMS_DB_ID

## 패턴 메모

- getInvoiceById에서 getInvoicePage + getInvoiceItems 병렬 조회 (Promise.all)
- env.ts는 빌드 시 환경변수 유효성 검증 (zod 사용)
