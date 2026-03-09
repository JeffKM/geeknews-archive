# Task 007: 환경변수 설정 및 Vercel 배포

## 개요

Phase 3까지 완성된 Invoice Web Viewer를 Vercel에 배포한다.
Notion API 연동, ISR(60초), @sparticuz/chromium 기반 PDF 생성이 Vercel 서버리스 환경에서 정상 동작하는지 검증한다.

## 관련 파일

- `src/lib/env.ts` — Zod 환경변수 검증 (빌드 시 누락 시 에러)
- `src/lib/pdf/generator.ts` — `process.env.VERCEL` 분기 (Vercel → @sparticuz/chromium)
- `next.config.ts` — `serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium']`
- `.env.example` — 환경변수 예시 파일
- `src/app/invoice/[id]/page.tsx` — ISR `revalidate = 60`

## 수락 기준

- [ ] 배포 URL로 `/invoice/[id]` 페이지 접속 가능 (Notion 데이터 표시)
- [ ] `/invoice/demo` 데모 페이지 정상 렌더링
- [ ] PDF 다운로드 버튼 클릭 시 파일 수신 (Vercel 서버리스 환경)
- [ ] 존재하지 않는 ID 접근 시 에러 페이지 표시 (흰 화면 없음)
- [ ] ISR 동작 확인 (Notion DB 수정 후 60초 이내 반영)

## 구현 단계

### 1단계: 사전 확인 (코드 검증)

- [ ] `npm run build` 성공 확인 (환경변수 없어도 빌드는 가능, 런타임 에러는 별도)
- [ ] `npm run check-all` 통과 확인

### 2단계: Vercel 프로젝트 생성

- [ ] Vercel 계정 로그인 (https://vercel.com)
- [ ] "Add New Project" → GitHub 레포지토리 연결 (권장)
  - 또는 Vercel CLI: `npx vercel` 실행 후 안내 따르기
- [ ] Framework Preset: **Next.js** 자동 감지 확인
- [ ] Root Directory: 프로젝트 루트 (변경 불필요)

### 3단계: 환경변수 설정 (Vercel 대시보드)

- [ ] Vercel 프로젝트 → Settings → Environment Variables
- [ ] `NOTION_API_KEY` 입력 (Production + Preview + Development 모두 체크)
- [ ] `NOTION_INVOICES_DB_ID` 입력
- [ ] `NOTION_ITEMS_DB_ID` 입력
- [ ] **Notion 연동 설정**: Notion 통합(Integration)에서 해당 DB에 연결 권한 부여 확인
  - Notion DB 페이지 → 우측 상단 "..." → "연결 추가" → 생성한 통합 선택

### 4단계: 배포 실행

- [ ] Vercel 대시보드에서 "Deploy" 클릭
  - 또는 `git push origin main` (GitHub 연동 시 자동 배포)
- [ ] 빌드 로그에서 에러 없음 확인
- [ ] 배포 URL 확인 (예: `https://invoice-web-xxx.vercel.app`)

### 5단계: 배포 후 검증

- [ ] Playwright MCP로 아래 테스트 체크리스트 순서대로 검증
- [ ] 테스트 실패 항목은 트러블슈팅 가이드 참고 후 재배포 및 재테스트

## 테스트 체크리스트 (Playwright MCP)

### 정상 시나리오

- [ ] 배포 URL로 `/invoice/demo` 접속 → 견적서 전체 섹션 렌더링 확인
- [ ] 실제 Notion 견적서 ID로 `/invoice/[id]` 접속 → Notion 데이터 표시 확인
- [ ] 발송됨/승인/초안/거절 상태 뱃지 색상 확인

### 에러 시나리오

- [ ] 존재하지 않는 ID(`/invoice/non-existent-id`) 접속 → 에러 페이지 표시 (흰 화면 금지)
- [ ] Notion 연결 오류 시 에러 바운더리 동작 확인

### PDF 시나리오

- [ ] PDF 다운로드 버튼 클릭 → `application/pdf` 파일 수신 확인
- [ ] 다운로드된 PDF 파일명 형식: `견적서_[번호]_[고객사명].pdf`
- [ ] PDF 내용이 웹 페이지 레이아웃과 동일한지 육안 확인

### ISR 시나리오

- [ ] Notion DB에서 견적서 데이터 수정
- [ ] 60초 대기 후 페이지 새로고침 → 변경된 데이터 반영 확인
- [ ] Vercel 대시보드 → Deployments → 함수 로그 확인

## 트러블슈팅 가이드

### @sparticuz/chromium 크기 초과 (Vercel Hobby 50MB 제한)

증상: 빌드 성공 후 PDF API 호출 시 `Function exceeded maximum bundle size` 에러

해결:

1. `vercel.json` 추가하여 메모리/시간 제한 조정:
   ```json
   {
     "functions": {
       "src/app/api/invoice/[id]/pdf/route.ts": {
         "memory": 3008,
         "maxDuration": 60
       }
     }
   }
   ```
2. `@sparticuz/chromium` → `@sparticuz/chromium-min` 교체 (더 작은 크기)
3. 대안: Vercel Pro 플랜 (250MB 제한)

### 환경변수 누락 (빌드 또는 런타임 에러)

증상: `ZodError: NOTION_API_KEY가 설정되지 않았습니다`

해결: Vercel 대시보드 → Settings → Environment Variables에서 3개 변수 모두 설정 확인

### Notion 연동 권한 오류 (403 또는 object_not_found)

증상: 유효한 ID임에도 에러 페이지 표시

해결:

1. Notion 통합이 해당 DB에 "연결"되어 있는지 확인
2. NOTION_INVOICES_DB_ID, NOTION_ITEMS_DB_ID가 올바른 DB를 가리키는지 확인

### ISR 캐시 미갱신

증상: Notion DB 수정 후 60초 이상 지나도 업데이트 안 됨

해결: Vercel 대시보드 → Storage → Cache → 해당 경로 수동 purge 또는 재배포

## 변경 사항 요약

_(작업 완료 후 기록)_

## 참고 사항

- Vercel Hobby 플랜: 서버리스 함수 최대 10초 실행 시간 (PDF 생성 시 초과 가능 → Pro 플랜 권장)
- `process.env.VERCEL`은 Vercel 배포 환경에서 자동으로 `"1"`로 설정됨
- ISR `revalidate = 60` 유지 필수 (shrimp-rules.md 금지사항)
