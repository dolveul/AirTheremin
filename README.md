# Base — 범용 프론트엔드 베이스 템플릿

React + TypeScript + Vite 기반의 **범용 베이스 템플릿**입니다.  
새 프로젝트나 AI 협업 시 공통 기준선으로 사용할 수 있도록 구성되어 있습니다.

- **기본 포지션**: CSR(클라이언트 사이드 렌더링) + 클라이언트 SEO 유틸
- **SSR**: 확장 옵션으로 열어 두며, 필요 시 [docs/SSR_AND_SEO.md](./docs/SSR_AND_SEO.md) 및 `vite-ssr.config.ts` 참고

## 📚 코딩 가이드라인

**모든 코딩 작업 전에 [`CODING_GUIDE.md`](./CODING_GUIDE.md)를 확인하세요.**

- **API**: 요청 단위 AbortController, 컴포넌트에서는 `useApi()` 훅 사용 시 언마운트 시 자동 중단
- **스타일**: Tailwind CSS 우선, rem 기반 폰트 규칙
- **품질**: type-aware ESLint, Prettier, CI(lint + format check + build)
- **성능**: React 실무 성능 가이드 — [docs/REACT_PERFORMANCE_GUIDE.md](docs/REACT_PERFORMANCE_GUIDE.md) (Vercel React Best Practices 기반)

## 기술 스택

- React 19 · TypeScript 5.9 · Vite 7 · Tailwind CSS 3.4 · React Compiler

## 시작하기

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 빌드
npm run lint     # 린트
npm run format   # 포맷 적용
npm run format:check  # 포맷 검사 (CI)
```

## 가이드 문서 (한 곳에서 보기)

| 문서 | 용도 |
|------|------|
| [CODING_GUIDE.md](./CODING_GUIDE.md) | **필수** 코딩 규칙·스타일·체크리스트 |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | 구현 예시(API, 폰트, SEO, 페이지) |
| [docs/WORK_LOG_GUIDE.md](./docs/WORK_LOG_GUIDE.md) | 작업 일지 사용법 |
| [docs/SSR_AND_SEO.md](./docs/SSR_AND_SEO.md) | SSR/SEO 포지셔닝 |
| [docs/REACT_PERFORMANCE_GUIDE.md](./docs/REACT_PERFORMANCE_GUIDE.md) | React 성능(실무) |
| [docs/PLAN.md](./docs/PLAN.md) | 기획·방향·요구사항 (프로젝트 시작 시 채움) |
| [docs/STRUCTURE.md](./docs/STRUCTURE.md) | 논리·책임 구조 (사람+AI 지도) |
| [docs/STATE_FLOW.md](./docs/STATE_FLOW.md) | 상태 소유·전달·변경 (AI용 제어판) |

## 프로젝트 구조 요약

- `src/components/` — 공통·레이아웃·기능별 컴포넌트
- `src/pages/` — 페이지 컴포넌트
- `src/hooks/` — `useApi` 등 커스텀 훅
- `src/utils/` — API 클라이언트(`api.ts`), SEO 유틸(`seo.ts`)
- `docs/` — 가이드 문서, 작업 일지(`work-logs/`)

## 라이선스

Private / 프로젝트 정책에 따름.
