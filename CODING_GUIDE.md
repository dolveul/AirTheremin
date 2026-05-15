# Base Project Frontend 코딩 가이드라인

> **⚠️ 중요: 모든 코딩 작업 전에 이 문서를 반드시 확인하고 준수하세요.**

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [파일 구조 규칙](#파일-구조-규칙)
4. [코딩 스타일](#코딩-스타일)
5. [컴포넌트 작성 규칙](#컴포넌트-작성-규칙)
6. [스타일링 규칙](#스타일링-규칙)
7. [TypeScript 규칙](#typescript-규칙)
8. [네이밍 컨벤션](#네이밍-컨벤션)
9. [Git 커밋 규칙](#git-커밋-규칙)
10. [코드 리뷰 체크리스트](#코드-리뷰-체크리스트)

---

## 프로젝트 개요

- **프로젝트명**: Project Base Frontend
- **프레임워크**: React 19.2.0 + TypeScript
- **빌드 도구**: Vite 7.2.4
- **스타일링**: Tailwind CSS 3.4.19
- **코드 품질**: ESLint + TypeScript

---

## 기술 스택

### 핵심 기술

- **React**: 19.2.0 (최신 버전)
- **TypeScript**: 5.9.3
- **Vite**: 7.2.4
- **Tailwind CSS**: 3.4.19
- **라우팅**: React Router (SSR/SSG 지원)

### 주요 특징

- React Compiler 활성화 (자동 최적화)
- TypeScript 엄격 모드
- ESLint 코드 품질 관리
- **SEO 최적화**: SSR/SSG를 통한 초기 HTML 텍스트 포함
- **애드센스 크롤링 지원**: 서버 사이드 렌더링으로 크롤러 친화적

---

## 파일 구조 규칙

### 디렉토리 구조

```
base-front/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── common/         # 공통 컴포넌트 (Button, Input 등)
│   │   ├── layout/         # 레이아웃 컴포넌트 (Header, Footer 등)
│   │   └── features/       # 기능별 컴포넌트
│   ├── pages/              # 페이지 컴포넌트
│   ├── hooks/              # Custom Hooks
│   ├── utils/              # 유틸리티 함수
│   ├── types/              # TypeScript 타입 정의
│   ├── services/           # API 서비스
│   ├── stores/             # 상태 관리 (필요시)
│   ├── assets/             # 정적 자산 (이미지, 폰트 등)
│   ├── styles/             # 전역 스타일 (필요시)
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── main.tsx            # 진입점
│   └── index.css           # 전역 CSS (Tailwind 포함)
├── public/                 # 정적 파일
├── tailwind.config.js      # Tailwind 설정
├── vite.config.ts          # Vite 설정
└── tsconfig.json           # TypeScript 설정
```

### 파일 네이밍 규칙

- **컴포넌트**: PascalCase (예: `UserProfile.tsx`)
- **유틸리티/훅**: camelCase (예: `useAuth.ts`, `formatDate.ts`)
- **타입 정의**: PascalCase (예: `UserTypes.ts`)
- **상수**: UPPER_SNAKE_CASE (예: `API_ENDPOINTS.ts`)

---

## 코딩 스타일

### 기본 원칙

1. **일관성**: 프로젝트 전체에 걸쳐 일관된 스타일 유지
2. **가독성**: 코드는 읽기 쉽고 이해하기 쉬워야 함
3. **간결성**: 불필요한 코드 제거, 명확한 의도 표현
4. **타입 안정성**: TypeScript의 타입 시스템 최대한 활용

### 코드 포맷팅

- 들여쓰기: 2 spaces (탭 사용 금지)
- 세미콜론: 사용 (ESLint 규칙 준수)
- 따옴표: 작은따옴표(`'`) 사용
- 줄 길이: 최대 100자 (가독성 고려)

### Import 순서

```typescript
// 1. React 및 라이브러리
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. 타입 정의
import type { User } from '@/types/User';

// 3. 컴포넌트
import Button from '@/components/common/Button';
import Header from '@/components/layout/Header';

// 4. 유틸리티/훅
import { formatDate } from '@/utils/date';
import { useAuth } from '@/hooks/useAuth';

// 5. 스타일
import './Component.css';
```

---

## 컴포넌트 작성 규칙

### 함수형 컴포넌트 사용

```typescript
// ✅ 좋은 예
interface UserCardProps {
  name: string
  email: string
  avatar?: string
}

export default function UserCard({ name, email, avatar }: UserCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      {/* 컴포넌트 내용 */}
    </div>
  )
}
```

### 컴포넌트 구조

```typescript
// 1. Imports
import { useState } from 'react'
import type { ComponentProps } from '@/types'

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export default function Component({ ... }: Props) {
  // 4. Hooks
  const [state, setState] = useState()

  // 5. Handlers
  const handleClick = () => {
    // ...
  }

  // 6. Effects
  useEffect(() => {
    // ...
  }, [])

  // 7. Render
  return (
    // JSX
  )
}
```

### 컴포넌트 분리 원칙

- **단일 책임 원칙**: 하나의 컴포넌트는 하나의 역할만 수행
- **재사용성**: 3번 이상 사용되면 컴포넌트로 분리 고려
- **크기 제한**: 컴포넌트는 200줄 이하로 유지 (가능한 한)

### Props 규칙

- Props는 항상 TypeScript 인터페이스로 정의
- 필수 props는 기본값 없이, 선택적 props는 `?` 사용
- Props는 최대한 명확하고 구체적으로 네이밍

---

## 스타일링 규칙

### Tailwind CSS 우선 사용

```typescript
// ✅ 좋은 예 - Tailwind 사용
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-800">제목</h2>
</div>

// ✅ 좋은 예 - 실무적으로 인라인 스타일이 더 적합한 경우
// (동적 값, 복잡한 계산 등)
<div style={{
  transform: `translateX(${offset}px)`,
  opacity: isVisible ? 1 : 0
}}>
  {/* 내용 */}
</div>

// ❌ 나쁜 예 - Tailwind로 충분한데 인라인 스타일 사용
<div style={{ display: 'flex', padding: '16px' }}>
  <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>제목</h2>
</div>
```

### 폰트 크기 규칙 (rem 기반)

**⚠️ 필수: 모든 폰트 크기는 rem 단위를 사용하고, 제한된 rem 수치만 사용**

#### 허용된 rem 수치 (제한적 사용)

```css
/* 루트 폰트 크기: 16px (기본값) */
:root {
  font-size: 16px; /* 1rem = 16px */
}

/* 허용된 rem 수치 목록 */
- 0.75rem  (12px)  /* 작은 텍스트, 캡션 */
- 0.875rem (14px)  /* 보조 텍스트 */
- 1rem     (16px)  /* 기본 본문 텍스트 */
- 1.125rem (18px)  /* 강조 본문 */
- 1.25rem  (20px)  /* 작은 제목 */
- 1.5rem   (24px)  /* 중간 제목 */
- 2rem     (32px)  /* 큰 제목 */
- 2.5rem   (40px)  /* 매우 큰 제목 */
- 3rem     (48px)  /* 히어로 제목 */
```

```typescript
// ✅ 좋은 예 - 제한된 rem 수치 사용
<h1 className="text-3rem">메인 제목</h1>
<p className="text-1rem">본문 텍스트</p>
<span className="text-0.875rem">보조 텍스트</span>

// ❌ 나쁜 예 - 허용되지 않은 rem 수치
<h1 className="text-2.3rem">제목</h1>  // 2.3rem은 허용 목록에 없음
<p className="text-1.7rem">본문</p>    // 1.7rem은 허용 목록에 없음
```

### CSS 파일 사용 규칙

- **전역 스타일**: `src/index.css`에만 작성
- **컴포넌트별 CSS**: 가능한 한 Tailwind 사용, 필요시에만 별도 CSS 파일
- **커스텀 클래스**: `tailwind.config.js`의 `theme.extend` 활용

### 반응형 디자인

```typescript
// Tailwind 반응형 클래스 사용
<div className="
  w-full
  md:w-1/2
  lg:w-1/3
  xl:w-1/4
">
  {/* 내용 */}
</div>
```

### 다크모드 지원 (필요시)

```typescript
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* 내용 */}
</div>
```

---

## TypeScript 규칙

### 타입 정의

```typescript
// ✅ 좋은 예 - 명시적 타입
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// ❌ 나쁜 예 - any 사용
function processUser(user: any) {
  // ...
}
```

### 타입 안전성

- `any` 타입 사용 금지 (필수적인 경우 `unknown` 사용)
- 타입 단언(`as`) 최소화, 타입 가드 활용
- 옵셔널 체이닝(`?.`) 적극 활용

### 타입 파일 구조

```typescript
// types/User.ts
export interface User {
  id: number;
  name: string;
}

export type UserRole = 'admin' | 'user' | 'guest';

// types/index.ts에서 재export
export * from './User';
```

---

## 네이밍 컨벤션

### 변수 및 함수

- **변수**: camelCase (예: `userName`, `isLoading`)
- **함수**: camelCase, 동사로 시작 (예: `getUserData`, `handleSubmit`)
- **상수**: UPPER_SNAKE_CASE (예: `API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Boolean**: `is`, `has`, `should` 접두사 사용 (예: `isVisible`, `hasError`)

### 컴포넌트

- **컴포넌트명**: PascalCase (예: `UserProfile`, `NavigationBar`)
- **파일명**: 컴포넌트명과 동일하게 (예: `UserProfile.tsx`)

### 이벤트 핸들러

- `handle` 접두사 사용 (예: `handleClick`, `handleSubmit`)
- 또는 `on` 접두사 (예: `onClick`, `onChange`)

---

## Git 커밋 규칙

### 커밋 메시지 형식

```
<type>: <subject>

<body>

<footer>
```

### 인코딩 안전 규칙 (중요)

- 이 저장소는 한글 커밋을 허용합니다.
- 단, `git commit -m "한글..."`은 금지하고 `git commit -F` 기반으로만 커밋합니다.
- 표준 절차는 `commit-msg.txt`(UTF-8) 작성 후 `.\scripts\commit-utf8.ps1` 실행입니다.
- `commit-msg.txt`는 에디터에서 직접 저장합니다. (터미널 heredoc/echo로 메시지 생성 금지)
- 푸시 작업 시에도 동일 절차로 커밋 완료 후 푸시합니다.

### 한글 커밋 표준 절차

```powershell
# 1) 커밋 메시지 작성 (UTF-8)
# commit-msg.txt 파일에 제목/본문 작성

# 2) 변경 스테이징
git add ...

# 3) UTF-8 커밋 스크립트 실행 (git commit -F 내부 수행)
.\scripts\commit-utf8.ps1

# 4) 푸시
git push
```

### Type 종류

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드 업무 수정, 패키지 매니저 설정 등

### 예시

```text
feat: 사용자 프로필 페이지 추가

- 사용자 정보 표시 컴포넌트 구현
- API 연동 및 에러 처리 추가
- 반응형 레이아웃 적용

Closes #123
```

---

## 코드 리뷰 체크리스트

코딩 전/후 다음 항목들을 확인하세요:

### 필수 체크리스트

- [ ] TypeScript 타입이 모든 변수/함수에 정의되어 있는가?
- [ ] `any` 타입을 사용하지 않았는가?
- [ ] ESLint 오류가 없는가?
- [ ] 컴포넌트가 단일 책임 원칙을 따르는가?
- [ ] Tailwind CSS를 우선적으로 사용했는가?
- [ ] 불필요한 console.log가 제거되었는가?
- [ ] 코드가 읽기 쉽고 이해하기 쉬운가?

### 권장 체크리스트

- [ ] 컴포넌트가 200줄 이하인가?
- [ ] 재사용 가능한 로직이 커스텀 훅으로 분리되었는가?
- [ ] 에러 처리가 적절히 구현되었는가?
- [ ] 로딩 상태가 적절히 표시되는가?
- [ ] 접근성(a11y)을 고려했는가?
- [ ] 반응형 디자인이 적용되었는가?

---

## 특별 주의사항

### React 19 특징 활용

- React Compiler가 자동으로 최적화하므로, 불필요한 `useMemo`, `useCallback` 남용 금지
- 새로운 Hooks API 적극 활용

### 성능 최적화

- 큰 리스트는 가상화(virtualization) 고려
- 이미지는 lazy loading 적용
- 코드 스플리팅 적극 활용

### 보안

- 사용자 입력은 항상 검증 및 sanitization
- API 키는 환경 변수로 관리
- XSS 방지를 위한 적절한 이스케이프 처리

---

## SSR/SSG 라우팅 규칙 (확장 시 참고)

**기본 포지션**: 이 템플릿은 CSR이 기본이며, SSR/SEO 포지셔닝은 [docs/SSR_AND_SEO.md](./docs/SSR_AND_SEO.md)를 참고하세요.

### 페이지 분류 (SSR 도입 시 참고)

1. **SSG (Static Site Generation)**: 정적 콘텐츠 페이지
   - 홈페이지, 소개 페이지, 정적 블로그 포스트 등
   - 빌드 시점에 HTML 생성
   - 최고의 SEO 성능

2. **SSR (Server-Side Rendering)**: 동적 콘텐츠 페이지
   - 사용자별 콘텐츠, 실시간 데이터 페이지
   - 요청 시점에 HTML 생성
   - 초기 로딩 시 텍스트 포함 보장

3. **CSR (Client-Side Rendering)**: 인터랙티브 페이지
   - 대시보드, 관리자 페이지 등
   - SEO가 중요하지 않은 페이지

### 구현 원칙

```typescript
// ✅ 좋은 예 - SSG 페이지
// pages/HomePage.tsx
export default function HomePage() {
  return (
    <div>
      <h1>홈페이지 제목</h1>
      <p>초기 HTML에 포함될 텍스트 콘텐츠</p>
    </div>
  )
}

// ✅ 좋은 예 - SSR 페이지
// pages/ArticlePage.tsx
export async function getServerSideProps(context) {
  const article = await fetchArticle(context.params.id)
  return { props: { article } }
}

export default function ArticlePage({ article }: { article: Article }) {
  return (
    <article>
      <h1>{article.title}</h1>
      <div>{article.content}</div>
    </article>
  )
}
```

### 초기 HTML 텍스트 포함 규칙

- **필수**: 모든 핵심 콘텐츠는 초기 HTML에 텍스트로 포함
- 이미지 alt 텍스트 필수
- 메타 태그 최적화 (title, description, og:tags)

---

## API 호출 및 요청 규칙

### 강제 중단 기능 필수

**⚠️ 필수: 모든 API 호출은 AbortController를 사용하여 중단 가능하도록 구현**

```typescript
// ✅ 좋은 예 - AbortController 사용
import { useEffect, useRef } from 'react';

function useApiCall() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = async (url: string) => {
    // 이전 요청이 있으면 중단
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });
      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted');
        return null;
      }
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 요청 중단
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { fetchData };
}
```

### API 서비스 구조

요청 단위로 `AbortController`를 사용합니다. 컴포넌트에서는 `useApi()` 훅을 쓰면 언마운트 시 해당 컴포넌트에서 시작한 요청이 자동 중단됩니다. 구현은 `src/utils/api.ts`, `src/hooks/useApi.ts`를 참고하세요.

---

## 코드 최적화 규칙

### 중복 코드 제거

- **DRY 원칙**: Don't Repeat Yourself
- 공통 로직은 유틸리티 함수나 커스텀 훅으로 분리
- 3번 이상 반복되는 코드는 반드시 추출

### 불필요한 코드 제거

- 사용하지 않는 import 제거
- 주석 처리된 코드 제거 (Git 히스토리로 관리)
- console.log 제거 (개발용은 개발 환경에서만)
- 사용하지 않는 변수/함수 제거

### 컴포넌트 최적화

- 불필요한 리렌더링 방지 (React Compiler가 자동 처리)
- 큰 컴포넌트는 작은 단위로 분리
- Props drilling 방지 (Context 또는 상태 관리 라이브러리 활용)

### 코드 리뷰 시 확인사항

- [ ] 중복된 코드가 없는가?
- [ ] 사용하지 않는 import가 없는가?
- [ ] 불필요한 console.log가 제거되었는가?
- [ ] 컴포넌트가 적절한 크기로 분리되었는가?

---

## 작업 일지 관리

### 자동 작업 일지 생성

**⚠️ 권장: 하루 작업이 끝날 때마다 작업 일지를 생성하고 업데이트하세요**

프로젝트에는 Git 커밋 로그를 기반으로 자동으로 작업 일지를 생성하는 시스템이 포함되어 있습니다.

#### 사용 방법

```bash
# 오늘 날짜의 작업 일지 생성/업데이트
npm run work-log

# 특정 날짜의 작업 일지 생성/업데이트
npm run work-log -- 2025-01-15
```

#### 작업 일지 위치

- 작업 일지 파일: `docs/work-logs/YYYY-MM-DD.md`
- 상세 가이드: `docs/WORK_LOG_GUIDE.md`

#### 자동 생성 기능

- Git 커밋 메시지 자동 수집
- 변경된 파일 목록 자동 생성
- 커밋 해시, 작성자, 시간 정보 포함
- 기존 내용 보존 (수동 작성 내용 유지)

#### 작업 일지 구조

각 작업 일지는 다음 섹션으로 구성됩니다:

- 📋 작업 개요
- ✅ 완료된 작업 (Git 커밋 기반 자동 생성)
- 📝 변경된 파일 (Git 로그 기반 자동 생성)
- 🚧 진행 중인 작업
- 📅 다음 작업 계획
- 💡 이슈 및 메모
- 📆 작업일 (날짜만, 시간 미기록)

자세한 내용은 [작업 일지 사용 가이드](docs/WORK_LOG_GUIDE.md)를 참고하세요.

---

## 참고 자료

### 프로젝트 내부 문서

- [docs/PLAN.md](./docs/PLAN.md) — 기획·방향·요구사항
- [docs/STRUCTURE.md](./docs/STRUCTURE.md) — UI 영역·배치·대략 비율(레이아웃)
- [docs/FUNCTION.md](./docs/FUNCTION.md) — 요소별 기능·동작
- [docs/DESIGN.md](./docs/DESIGN.md) — 디자인 철학·토큰·참고 코드(Stitch 등)
- [docs/STATE_FLOW.md](./docs/STATE_FLOW.md) — 상태·흐름·파일 작업 지도 (주로 AI 유지)
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) — 구현 예시(API, 폰트, SEO, 페이지)
- [docs/WORK_LOG_GUIDE.md](./docs/WORK_LOG_GUIDE.md) — 작업 일지 사용법
- [docs/SSR_AND_SEO.md](./docs/SSR_AND_SEO.md) — SSR/SEO 포지셔닝
- [docs/REACT_PERFORMANCE_GUIDE.md](./docs/REACT_PERFORMANCE_GUIDE.md) — React 성능(실무 요약)

### 외부

- [React 공식 문서](https://react.dev)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Vite 가이드](https://vitejs.dev/guide/)

---

**마지막 업데이트**: 2025-12-29
**유지보수자**: 개발팀
