# React 실무 성능 가이드

[Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)를 바탕으로 **실무에서 바로 쓸 수 있는** 우선순위와 패턴만 정리한 문서입니다.  
상세 규칙·예시는 아래 링크(GitHub 원본)를 참고하세요.

---

## 1. 이 가이드 사용법

- **코드 작성·리뷰 시**: 아래 우선순위대로 적용 가능한지 먼저 확인.
- **원본 규칙**: 각 항목 옆 링크로 상세 설명·예제 확인(GitHub).
- **이 프로젝트**: CSR + Vite 기준. `server-*` 규칙은 SSR/Next 도입 시 참고.

---

## 2. 우선순위 요약

| 순위 | 분류 | 영향도 | 실무에서 먼저 할 것 |
|------|------|--------|---------------------|
| 1 | 워터폴 제거 | CRITICAL | 독립 비동기는 `Promise.all`, 연쇄 await 지양 |
| 2 | 번들 크기 | CRITICAL | barrel import 지양, 직접 import·동적 import |
| 3 | 서버 성능 | HIGH | SSR 시 캐시·병렬 fetch (현재 템플릿은 CSR) |
| 4 | 클라이언트 fetch | MEDIUM-HIGH | 요청 중복 제거(SWR 등), 이벤트 리스너 정리 |
| 5 | 리렌더 최적화 | MEDIUM | 파생값은 렌더 시 계산, useState 초기값은 함수형 |
| 6 | 렌더링 | MEDIUM | 조건부 렌더는 삼항 연산자, 무거운 건 lazy |
| 7 | JS 미세 최적화 | LOW-MEDIUM | 반복문 내 객체 접근·정규식 캐싱, Set/Map 활용 |
| 8 | 고급 패턴 | LOW | 이벤트 핸들러 ref, 초기화 1회 등 |

---

## 3. 실무에서 자주 쓰는 패턴

### 3.1 비동기: 병렬 실행 (CRITICAL)

독립된 API/비동기 작업은 한 번에 요청하고 `Promise.all`로 기다리기.

```ts
// ❌ 순차 (지연 3배)
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()

// ✅ 병렬
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments(),
])
```

- [규칙: async-parallel](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md)
- 의존 관계가 있으면 `async-dependencies`, `async-defer-await` 참고.

---

### 3.2 번들: barrel import 지양 (CRITICAL)

`index`에서 re-export하는 대량 라이브러리는 직접 경로로 import.

```tsx
// ❌ barrel – lucide, MUI 등에서 수백~수천 모듈 로드
import { Check, X, Menu } from 'lucide-react'

// ✅ 직접 import
import Check from 'lucide-react/dist/esm/icons/check'
import Button from '@mui/material/Button'
```

- [규칙: bundle-barrel-imports](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-barrel-imports.md)
- 무거운 컴포넌트는 `React.lazy` + `Suspense`로 나누기: [bundle-dynamic-imports](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md)

---

### 3.3 클라이언트 fetch: 중복 제거 (MEDIUM-HIGH)

같은 URL을 여러 컴포넌트에서 쓰면 SWR 등으로 한 요청만 쓰기.

```tsx
// ❌ 컴포넌트마다 fetch
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers)
  }, [])
}

// ✅ SWR로 캐시·디듀프
import useSWR from 'swr'
function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

- [규칙: client-swr-dedup](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/client-swr-dedup.md)  
- 이 템플릿의 `useApi()`는 AbortSignal만 공유; 요청 디듀프가 필요하면 SWR/React Query 도입 검토.

---

### 3.4 파생 상태: 렌더 시 계산 (MEDIUM)

props/state로 계산 가능한 값은 state나 effect에 넣지 말고 렌더 시 계산.

```tsx
// ❌ effect로 동기화 → 불필요 리렌더·드리프트 위험
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(firstName + ' ' + lastName)
}, [firstName, lastName])

// ✅ 렌더 시 파생
const fullName = firstName + ' ' + lastName
```

- [규칙: rerender-derived-state-no-effect](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rerender-derived-state-no-effect.md)
- React 문서: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

---

### 3.5 useState 초기값: 비용 큰 경우 함수형 (MEDIUM)

초기값 계산이 무거우면 함수 형태로 넘겨 한 번만 실행되게 하기.

```tsx
// ❌ 매 렌더마다 실행
const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings') || '{}'))

// ✅ 마운트 시 1회만
const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('settings') || '{}'))
```

- [규칙: rerender-lazy-state-init](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rerender-lazy-state-init.md)

---

### 3.6 조건부 렌더: 0/NaN 주의 (MEDIUM)

`count && <Badge />` 는 `count === 0` 일 때 `0`이 화면에 나옴. 숫자일 땐 삼항 사용.

```tsx
// ❌ count가 0이면 "0" 렌더
{count && <span className="badge">{count}</span>}

// ✅
{count > 0 ? <span className="badge">{count}</span> : null}
```

- [규칙: rendering-conditional-render](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rendering-conditional-render.md)

---

## 4. 카테고리별 규칙 인덱스

필요할 때만 해당 규칙 파일을 열어서 참고하면 됩니다.

| 접두사 | 분류 | 대표 규칙 |
|--------|------|-----------|
| `async-` | 워터폴 제거 | [async-parallel](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md), [async-defer-await](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-defer-await.md), [async-suspense-boundaries](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-suspense-boundaries.md) |
| `bundle-` | 번들 | [bundle-barrel-imports](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-barrel-imports.md), [bundle-dynamic-imports](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md), [bundle-conditional](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-conditional.md) |
| `server-` | 서버(SSR 시) | [server-parallel-fetching](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/server-parallel-fetching.md), [server-cache-react](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/server-cache-react.md) |
| `client-` | 클라이언트 | [client-swr-dedup](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/client-swr-dedup.md), [client-event-listeners](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/client-event-listeners.md) |
| `rerender-` | 리렌더 | [rerender-derived-state-no-effect](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rerender-derived-state-no-effect.md), [rerender-memo](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rerender-memo.md), [rerender-lazy-state-init](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rerender-lazy-state-init.md) |
| `rendering-` | 렌더링 | [rendering-conditional-render](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rendering-conditional-render.md), [rendering-content-visibility](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/rendering-content-visibility.md) |
| `js-` | JS | [js-cache-property-access](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/js-cache-property-access.md), [js-set-map-lookups](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/js-set-map-lookups.md) |
| `advanced-` | 고급 | [advanced-init-once](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/advanced-init-once.md) |

전체 목록·설명은 [SKILL.md](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) 참고.

---

## 5. 이 프로젝트(CSR + Vite) 적용 팁

- **API**: 이미 `useApi()`로 AbortSignal 공유 중. 병렬 호출은 `Promise.all` + 동일 `api` 인스턴스로 처리.
- **번들**: 아이콘/UI 라이브러리 쓸 때 barrel 대신 직접 import 또는 Vite에서 tree-shake 되도록 설정.
- **라우트**: 페이지 단위 `React.lazy`는 이미 적용되어 있음; 무거운 컴포넌트만 추가로 lazy 검토.
- **SSR 전환 시**: 위 인덱스의 `server-*` 규칙(GitHub)과 [docs/SSR_AND_SEO.md](./SSR_AND_SEO.md) 참고.

---

## 6. 참고

- 원본: [Vercel agent-skills / react-best-practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)
- 프로젝트 코딩 규칙: [CODING_GUIDE.md](../CODING_GUIDE.md)
