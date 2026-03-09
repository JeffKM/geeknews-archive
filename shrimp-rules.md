# Invoice Web Viewer - AI Agent 개발 규칙

## 프로젝트 개요

- **목적**: 노션 DB 견적서 데이터를 웹에서 열람하고 PDF로 다운로드하는 서비스
- **스택**: Next.js 15.5.3 (App Router), React 19, TypeScript 5, TailwindCSS v4, shadcn/ui, @notionhq/client
- **배포**: Vercel (서버리스)
- **현재 상태**: Phase 1~3(Task 005) 완료. Task 006(PDF 생성) 다음 구현 대상

---

## 프로젝트 아키텍처

```
Notion API → src/lib/notion/ → src/lib/invoice/ → src/components/invoice/ → src/app/
```

### 핵심 파일 위치

| 파일                                    | 역할                                          |
| --------------------------------------- | --------------------------------------------- |
| `src/lib/notion/client.ts`              | Notion API 클라이언트 싱글톤 (서버 전용)      |
| `src/lib/notion/invoice.ts`             | 견적서 데이터 조회 함수 (서버 전용)           |
| `src/lib/notion/types.ts`               | Notion API 응답 원시 타입                     |
| `src/lib/invoice/types.ts`              | 도메인 모델 타입 (InvoiceData 등)             |
| `src/lib/invoice/transformer.ts`        | Notion → 도메인 모델 변환                     |
| `src/lib/invoice/formatters.ts`         | KRW 포맷, 날짜 포맷, 사업자번호 포맷          |
| `src/lib/env.ts`                        | 환경변수 Zod 검증 (서버 전용)                 |
| `src/app/invoice/[id]/page.tsx`         | 견적서 뷰어 페이지 (Server Component, ISR=60) |
| `src/app/api/invoice/[id]/pdf/route.ts` | PDF 생성 API Route (현재 미구현, 501 반환)    |
| `src/components/invoice/`               | 견적서 UI 컴포넌트 모음                       |
| `docs/ROADMAP.md`                       | 개발 로드맵 (완료 태스크 추적)                |
| `tasks/`                                | 작업 명세 파일 디렉토리                       |

---

## 데이터 레이어 규칙

- `src/lib/notion/client.ts`는 **서버 전용**. `"use client"` 파일에서 절대 임포트 금지
- `src/lib/notion/invoice.ts`의 함수들은 Server Component나 API Route에서만 호출
- Notion 원시 데이터 타입은 `src/lib/notion/types.ts`에 정의, 도메인 타입은 `src/lib/invoice/types.ts`에 정의 - **두 파일을 혼용하지 않는다**
- 도메인 모델 변환은 반드시 `src/lib/invoice/transformer.ts`를 통해 수행
- 새 포맷 함수는 `src/lib/invoice/formatters.ts`에 추가

### 타입 수정 시 동시 수정 필요 파일

`src/lib/invoice/types.ts` 수정 → `src/lib/invoice/transformer.ts` + 관련 컴포넌트 확인

---

## 환경변수 규칙

- 필수 환경변수: `NOTION_API_KEY`, `NOTION_INVOICES_DB_ID`, `NOTION_ITEMS_DB_ID`
- **`NEXT_PUBLIC_` 접두사 절대 사용 금지** (Notion 키 클라이언트 노출 방지)
- 새 환경변수 추가 시 → `src/lib/env.ts`의 `envSchema`에 Zod 스키마 등록 필수
- `.env.local`에 실제 값, `.env.example`에 빈 값 예시 동시 업데이트

---

## 컴포넌트 규칙

- **Server Component 기본**. 상태/이벤트/브라우저 API 필요할 때만 `"use client"` 추가
- 현재 `"use client"` 파일: `src/components/invoice/pdf-download-button.tsx`만 해당
- 새 견적서 컴포넌트 → `src/components/invoice/` 에 위치, kebab-case 파일명
- shadcn/ui 기본 컴포넌트 → `src/components/ui/` (절대 직접 수정 금지)
- 임포트는 반드시 `@/` 경로 별칭 사용 (상대 경로 `../../` 금지)

### 컴포넌트 추가 시 규칙

```
# ✅ 올바른 위치
src/components/invoice/new-component.tsx  # 견적서 관련
src/components/ui/                         # shadcn add 명령으로만 추가

# ❌ 잘못된 위치
src/components/new-component.tsx          # 루트에 직접 추가 금지
```

---

## API Route 규칙

- API 응답은 반드시 `ApiResponse<T>` 래퍼 사용 (정의: `src/lib/invoice/types.ts`)
- 에러 응답 형식: `{ success: false, error: string }` + 적절한 HTTP 상태코드
- 성공 응답 형식: `{ success: true, data: T }`
- Notion 페이지 없음 에러: `error.message`에 `'Could not find page'`, `'object_not_found'`, `'unauthorized'` 포함 여부로 판별 → 404 반환

---

## ISR 및 캐싱 규칙

- `src/app/invoice/[id]/page.tsx`의 `revalidate = 60` 유지 (Notion API rate limit 대응)
- `generateMetadata`에서도 동일한 `getInvoiceById` 호출 (중복 조회는 Next.js가 캐싱)
- 견적서 페이지 메타데이터: 반드시 `robots: { index: false, follow: false }` 유지

---

## PDF 생성 구현 규칙 (Task 006 - 다음 구현 대상)

- 라이브러리: `puppeteer` + `@sparticuz/chromium` (Vercel 서버리스 필수)
- Vercel 이슈 발생 시 대안: `@react-pdf/renderer`
- 파일명 형식: `견적서_[견적서번호]_[고객사명].pdf` (Content-Disposition 헤더에 UTF-8 인코딩)
- 구현 위치: `src/app/api/invoice/[id]/pdf/route.ts` (현재 501 플레이스홀더)

---

## 작업 워크플로우 규칙

1. 새 기능 구현 전 → `tasks/XXX-description.md` 파일 생성 (XXX = 3자리 번호)
2. 구현 완료 후 → `docs/ROADMAP.md`에서 해당 작업을 "완료" 표시
3. 각 구현 단계 후 Playwright MCP로 테스트 수행 (API 응답, 에러 시나리오, 경계값)
4. 작업 완료 체크: `npm run check-all` 통과 필수

### 작업 파일 네이밍

```
tasks/001-project-structure.md   # ✅ 올바른 형식
tasks/my-task.md                 # ❌ 번호 없음
```

---

## 금지사항

- `src/lib/notion/` 하위 파일을 `"use client"` 컴포넌트에서 임포트 - **절대 금지**
- `NEXT_PUBLIC_` 접두사 환경변수 추가 - **절대 금지**
- `src/components/ui/` 파일 직접 수정 - **금지** (shadcn/ui 관리 파일)
- 상대 경로 임포트 (`../../`) - **금지**
- `revalidate = 60` 제거 또는 변경 - **금지** (Notion API rate limit 대응)
- 견적서 페이지 `robots: noindex` 제거 - **금지** (비공개 문서)
- `InvoiceData` 타입 수정 없이 컴포넌트에서 임의 타입 사용 - **금지**

---

## 코드 스타일 규칙

- 들여쓰기: 2칸
- 파일명: kebab-case (`invoice-header.tsx`)
- 컴포넌트명: PascalCase (`InvoiceHeader`)
- 임포트 순서: 외부 라이브러리 → `@/` 내부 → 상대 경로
- 파일 크기: 300줄 이하 유지
- 한국어 주석 필수
- `export function` (named export) 우선, 페이지 컴포넌트만 `export default`
