# SSR / SEO 포지셔닝

이 템플릿의 **기본 포지션**과 확장 방향을 명시합니다.

## 기본 포지션: CSR + 클라이언트 SEO

- **라우팅·렌더링**: React Router + Vite 기반 **클라이언트 사이드 렌더링(CSR)** 이 기본입니다.
- **SEO**: `src/utils/seo.ts`의 **클라이언트 SEO 유틸**(`setPageMeta`, `generateStructuredData`)을 사용해, 마운트 후 `document`를 갱신하는 방식이 기본입니다.
- **의도**: “범용 베이스 템플릿 + AI 협업 기준선”으로, 의도가 명확하고 안전한 기본 골격을 제공합니다. SSR은 확장 옵션으로 열어둡니다.

## setPageMeta와 SSR

- `setPageMeta()`는 **브라우저 환경**을 전제로 `document.title` 및 `<meta>` 등을 직접 조작합니다.
- **SSR 환경**에서는 서버에서 HTML에 메타 태그를 넣는 방식이 필요하므로, 현재 구현은 SSR에서 그대로 사용할 수 없습니다.
- **SSR로 확장할 때**: 서버 렌더 경로에서는 `setPageMeta` 대신 서버용 메타 생성(예: Helmet 대체, 또는 라우트별 메타 데이터를 서버에서 주입)을 사용하는 **SSR-safe 대안**을 도입하는 것이 좋습니다. 이 템플릿에서는 해당 가능성만 문서로 명시하며, 구현은 프로젝트별로 진행합니다.

## SSR 관련 파일·설정의 역할

| 대상 | 역할 |
|------|------|
| `vite-ssr.config.ts` | SSR/SSG로 **확장할 때** 참고할 수 있는 설정 예시. 기본 빌드/개발에는 사용하지 않음. |
| `CODING_GUIDE.md` 내 SSR/SSG 섹션 | SSR 도입 시 참고할 규칙·개념. 기본 템플릿은 CSR 기준. |
| `IMPLEMENTATION_GUIDE.md` 내 SSR 옵션 | 향후 SSR 도입 시 선택할 수 있는 구현 옵션 정리. |

SSR을 쓰지 않는 한 위 설정/파일은 “확장 예시”로만 참고하면 됩니다.

## SSR로 확장할 때 참고

- **옵션 1**: Vite SSR 가이드에 따른 엔트리 분리 + Node 서버 (현재 `vite-ssr.config.ts` 방향).
- **옵션 2**: `vite-plugin-ssr` 등 플러그인 도입.
- **옵션 3**: Next.js 등 프레임워크로 마이그레이션.

구체적 단계는 `IMPLEMENTATION_GUIDE.md`를 참고하세요.
