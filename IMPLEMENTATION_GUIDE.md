# 구현 가이드

이 문서는 실제 구현 시 참고할 수 있는 구체적인 예시와 패턴을 제공합니다.

## SSR/SSG (확장 옵션)

**기본 포지션**: 이 템플릿은 CSR + 클라이언트 SEO 유틸이 기본입니다.  
**SSR/SEO 포지셔닝 상세**: [docs/SSR_AND_SEO.md](./docs/SSR_AND_SEO.md)

### 현재 구조
- React Router를 사용한 클라이언트 사이드 라우팅 (CSR)
- SSR로 확장할 때 참고할 수 있는 설정 예시: `vite-ssr.config.ts`

### SSR/SSG 확장 시 참고 옵션

#### 옵션 1: Vite SSR 플러그인 사용
```bash
npm install vite-plugin-ssr
```

#### 옵션 2: Next.js로 마이그레이션
더 완전한 SSR/SSG 지원을 원할 경우 Next.js로 마이그레이션 고려

#### 옵션 3: 커스텀 SSR 서버
Node.js + Express를 사용한 커스텀 SSR 서버 구축

## API 호출 예시

### 기본 사용법
```typescript
import { useApi } from '@/hooks/useApi'

function MyComponent() {
  const api = useApi()
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/api/data')
      .then(setData)
      .catch(console.error)
  }, [])

  return <div>{data && JSON.stringify(data)}</div>
}
```

### 컴포넌트 언마운트 시 자동 중단
`useApi()` 훅을 사용하면 해당 컴포넌트에서 시작한 요청에 공통 `AbortSignal`이 붙으며, 언마운트 시 자동으로 중단됩니다. 수동 중단이 필요하면 `AbortController`를 만들어 `get/post(..., { signal })`로 전달하면 됩니다.

## 폰트 크기 사용 예시

### Tailwind 클래스 사용
```typescript
// ✅ 좋은 예
<h1 className="text-5xl">제목</h1>        // 3rem
<p className="text-base">본문</p>          // 1rem
<span className="text-sm">보조 텍스트</span> // 0.875rem

// ❌ 나쁜 예
<h1 className="text-[2.3rem]">제목</h1>  // 허용되지 않은 수치
```

### CSS 변수 사용
```css
.my-text {
  font-size: var(--font-base);  /* 1rem */
}
```

## 페이지 구조 예시

### SSG 페이지 (정적 콘텐츠)
```typescript
// pages/StaticPage.tsx
export default function StaticPage() {
  return (
    <div>
      <h1 className="text-5xl">정적 페이지 제목</h1>
      <p className="text-base">
        이 콘텐츠는 빌드 시점에 HTML로 생성됩니다.
      </p>
    </div>
  )
}
```

### SSR 페이지 (동적 콘텐츠)
```typescript
// pages/DynamicPage.tsx
import { useApi } from '@/hooks/useApi'
import { useEffect, useState } from 'react'

export default function DynamicPage() {
  const api = useApi()
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/api/dynamic-data')
      .then(setData)
      .catch(console.error)
  }, [])

  if (!data) return <div>로딩 중...</div>

  return (
    <div>
      <h1 className="text-5xl">{data.title}</h1>
      <p className="text-base">{data.content}</p>
    </div>
  )
}
```

## SEO 최적화 예시

### 메타 태그 설정
```typescript
import { useEffect } from 'react'
import { setPageMeta } from '@/utils/seo'

export default function SEOOptimizedPage() {
  useEffect(() => {
    setPageMeta({
      title: '페이지 제목',
      description: '페이지 설명',
      keywords: ['키워드1', '키워드2'],
      ogImage: '/og-image.jpg',
    })
  }, [])

  return (
    <div>
      <h1 className="text-5xl">페이지 제목</h1>
      <p className="text-base">초기 HTML에 포함될 텍스트</p>
    </div>
  )
}
```

## 작업 완료 후 확인

작업 완료 후 체크리스트는 **[CODING_GUIDE.md](./CODING_GUIDE.md)**의 코드 리뷰 체크리스트를 참고하세요.

