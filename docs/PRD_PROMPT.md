# MVP PRD 생성 메타 프롬프트

> 이 파일은 Claude Code에게 견적서 웹 뷰어 MVP의 PRD를 생성하도록 지시하는 메타 프롬프트입니다.
> 아래 프롬프트를 Claude Code에 그대로 입력하세요.

---

## 사용 방법

아래 `---` 사이의 내용을 복사하여 Claude Code에 붙여넣으세요.

---

당신은 시니어 프로덕트 매니저입니다.
아래 컨텍스트를 바탕으로 `docs/PRD.md` 파일에 MVP PRD 문서를 작성해주세요.

## 프로젝트 컨텍스트

**프로젝트명**: Invoice Web Viewer

**핵심 워크플로우**:

1. 견적서 작성자(나)가 노션(Notion)에서 견적서 데이터를 입력한다
2. 시스템이 노션 데이터를 읽어와 웹 페이지로 렌더링한다
3. 클라이언트는 고유 링크(URL)로 접속해 견적서를 웹으로 확인한다
4. 클라이언트는 버튼 클릭으로 견적서를 PDF로 다운로드한다

**핵심 사용자**:

- 견적서 작성자(나): 노션에서 데이터를 입력하는 1인 사업자/프리랜서
- 클라이언트: 링크를 받아 견적서를 확인하는 고객

**기술 스택** (변경 불가):

- Framework: Next.js 15.5.3 (App Router)
- Runtime: React 19 + TypeScript 5
- Styling: TailwindCSS v4 + shadcn/ui (new-york style)
- Data Source: Notion API (노션 데이터베이스에서 견적서 데이터 읽기)
- PDF: @react-pdf/renderer 또는 puppeteer (서버사이드 PDF 생성)

## PRD 작성 지침

다음 구조로 `docs/PRD.md`를 작성하세요. **한국어**로 작성하세요.

### 1. 문서 헤더

- 프로젝트명, 버전(v1.0.0-MVP), 작성일, 작성자
- 한 줄 요약: 노션으로 입력한 견적서를 클라이언트가 웹에서 확인하고 PDF로 다운받을 수 있는 서비스

### 2. 문제 정의 (Problem Statement)

- 현재 문제: 견적서를 Word/Excel로 만들어 이메일로 전송하는 비효율적 프로세스
- 해결하려는 문제: 노션에서 데이터 입력 → 자동으로 전문적인 웹 견적서 생성
- 성공 지표(MVP 기준): 노션 데이터 → 웹 렌더링 → PDF 다운로드 전체 플로우 동작

### 3. 사용자 스토리 (User Stories)

다음 형식으로 각 스토리를 작성하세요:
**[역할]로서, [목적]을 위해, [행동]을 하고 싶다. (수용 기준: ...)**

포함할 스토리:

- US-001: 견적서 작성자 - 노션에 견적서 데이터 입력
- US-002: 견적서 작성자 - 클라이언트에게 고유 링크 공유
- US-003: 클라이언트 - 웹 브라우저로 견적서 확인
- US-004: 클라이언트 - PDF 다운로드
- US-005: 견적서 작성자 - 견적서 상태 관리 (초안/발송/승인/거절)

### 4. 기능 요구사항 (Functional Requirements)

#### FR-1: 노션 데이터 연동

필수 노션 데이터베이스 필드를 정의하세요:

- 견적서 기본 정보: 견적서 번호, 제목, 생성일, 유효기간, 상태
- 발행자 정보: 회사명, 담당자명, 이메일, 전화번호, 사업자번호
- 고객 정보: 고객사명, 담당자명, 이메일
- 견적 항목: (하위 아이템 또는 관계형 DB) 항목명, 수량, 단가, 금액, 비고
- 합계 정보: 소계, 부가세(10%), 총액
- 비고: 결제 조건, 유효기간 안내, 특이사항

#### FR-2: 견적서 웹 뷰어

- 고유 URL 구조: `/invoice/[id]` (노션 페이지 ID 기반)
- 견적서 레이아웃: A4 비율 유지, 인쇄 최적화 디자인
- 포함 섹션: 헤더(로고+견적서 제목), 발행자/고객 정보, 항목 테이블, 합계, 하단 안내
- 상태 표시: 초안(Draft)/발송됨(Sent)/승인(Approved)/거절(Rejected) 뱃지
- 반응형: 모바일에서도 읽기 가능

#### FR-3: PDF 다운로드

- 다운로드 버튼 클릭 시 PDF 생성 및 다운로드
- 파일명 형식: `견적서_[견적서번호]_[고객사명].pdf`
- 웹 렌더링과 동일한 레이아웃 유지
- 서버사이드 PDF 생성 (API Route 사용)

#### FR-4: 접근 제어 (MVP 최소 보안)

- 비공개 링크 방식: 노션 페이지 ID(UUID) 자체가 접근 키 역할
- 삭제된/비공개 견적서 접근 시 404 페이지
- 만료된 견적서 접근 시 안내 메시지 표시

### 5. 비기능 요구사항 (Non-Functional Requirements)

- 성능: 초기 페이지 로드 3초 이내 (노션 API 응답 포함)
- 캐싱: 노션 데이터 ISR(Incremental Static Regeneration) 적용, 재검증 주기 60초
- 접근성: 시맨틱 HTML, 기본 ARIA 레이블
- 인쇄: `@media print` CSS로 인쇄 최적화

### 6. 시스템 아키텍처 (MVP)

다음 다이어그램을 Mermaid 형식으로 포함하세요:

```
노션 DB → Notion API → Next.js Server → 웹 뷰어 (클라이언트)
                                      ↘ PDF 생성 API → PDF 파일
```

**페이지/API 구조**:

```
src/app/
├── invoice/
│   └── [id]/
│       ├── page.tsx          # 견적서 웹 뷰어 (Server Component)
│       └── not-found.tsx     # 404 페이지
├── api/
│   └── invoice/
│       └── [id]/
│           └── pdf/
│               └── route.ts  # PDF 생성 API Route
└── ...

src/components/
└── invoice/
    ├── invoice-view.tsx      # 견적서 메인 뷰 컴포넌트
    ├── invoice-header.tsx    # 헤더 (발행자/고객 정보)
    ├── invoice-items.tsx     # 항목 테이블
    ├── invoice-summary.tsx   # 합계 섹션
    ├── invoice-footer.tsx    # 하단 안내
    └── pdf-download-button.tsx # PDF 다운로드 버튼 (Client Component)

src/lib/
├── notion/
│   ├── client.ts            # Notion API 클라이언트
│   ├── invoice.ts           # 견적서 데이터 페칭 함수
│   └── types.ts             # Notion 응답 타입
└── invoice/
    ├── types.ts             # 견적서 도메인 타입
    └── transformer.ts       # Notion 데이터 → 견적서 도메인 변환
```

### 7. 노션 데이터베이스 스키마

노션 데이터베이스 설계를 다음 형식으로 명세하세요:

**메인 DB: Invoices**
| 필드명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
| (각 필드 정의) | | | |

**서브 DB: Invoice Items** (별도 DB 또는 서브아이템)
| 필드명 | 타입 | 설명 | 필수 |
|--------|------|------|------|
| (각 필드 정의) | | | |

### 8. 환경변수

```env
# 필수 환경변수
NOTION_API_KEY=           # 노션 Integration 토큰
NOTION_INVOICES_DB_ID=    # 견적서 메인 데이터베이스 ID
NOTION_ITEMS_DB_ID=       # 견적 항목 데이터베이스 ID (별도 DB인 경우)
```

### 9. MVP 범위 정의

**✅ MVP에 포함**:

- 노션 DB 데이터 읽기 및 웹 렌더링
- 견적서 상세 페이지 (`/invoice/[id]`)
- PDF 다운로드
- 기본 에러 처리 (404, API 오류)
- 노션 데이터 캐싱 (ISR)

**❌ MVP에서 제외 (향후 버전)**:

- 사용자 인증/로그인 (견적서 작성자 관리 패널)
- 견적서 목록 페이지
- 클라이언트의 온라인 승인/거절 기능
- 이메일 자동 발송
- 다국어 지원
- 견적서 템플릿 커스터마이징
- 결제 연동

### 10. 개발 마일스톤

**Phase 1 - 기반 구축** (1주):

- [ ] 노션 API 연동 및 데이터 페칭
- [ ] 견적서 도메인 타입 정의
- [ ] Notion 데이터 → 도메인 모델 변환

**Phase 2 - 웹 뷰어** (1주):

- [ ] 견적서 레이아웃 컴포넌트 개발
- [ ] `/invoice/[id]` 페이지 구현
- [ ] ISR 캐싱 적용
- [ ] 404/에러 처리

**Phase 3 - PDF** (3일):

- [ ] PDF 생성 라이브러리 선택 및 설정
- [ ] PDF API Route 구현
- [ ] PDF 다운로드 버튼 연동

**Phase 4 - 완성도** (2일):

- [ ] 반응형 디자인 검토
- [ ] 인쇄 스타일 최적화
- [ ] 성능 검토 (LCP, 노션 API 응답 시간)
- [ ] 배포 (Vercel)

### 11. 기술적 결정 사항 (Technical Decisions)

다음 항목에 대한 기술적 결정과 근거를 작성하세요:

- PDF 생성 방식 선택: `@react-pdf/renderer` vs `puppeteer` vs `html2canvas`
- 노션 데이터 캐싱 전략: ISR vs SWR vs 전체 캐싱 비활성화
- 견적 항목 저장 방식: 노션 서브아이템 vs 별도 관계형 DB
- URL 보안: 현재 UUID 기반 비공개 링크 방식의 한계 및 향후 개선 방향

---

## 작성 시 주의사항

1. **실용적으로 작성**: MVP이므로 과도한 설계 금지. 동작하는 최소 기능에 집중
2. **기술 스택 준수**: Next.js 15 App Router, Server Components, TailwindCSS v4, shadcn/ui 사용
3. **노션 API 현실 반영**: 노션 API의 rate limit(3req/sec), 응답 구조의 복잡성 고려
4. **한국 비즈니스 맥락**: 부가세 10%, 사업자번호 형식, 한국어 견적서 레이아웃
5. **파일 저장 위치**: `docs/PRD.md`에 저장

---

_이 메타 프롬프트는 `/Users/jefflee/workspace/courses/invoice-web/docs/PRD_PROMPT.md`에 저장되어 있습니다._
