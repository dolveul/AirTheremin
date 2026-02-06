# vercel_best — React 성능 규칙 원본

[Vercel agent-skills / react-best-practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)를 복사해 둔 폴더입니다.  
**실무에서 참고할 가이드는 아래 문서를 보면 됩니다.**

---

## 실무용 가이드 (우선 읽기)

- **[docs/REACT_PERFORMANCE_GUIDE.md](../docs/REACT_PERFORMANCE_GUIDE.md)**  
  → 우선순위별 요약, 자주 쓰는 패턴, 이 프로젝트(CSR+Vite) 적용 팁

---

## 이 폴더 구조

| 항목 | 설명 |
|------|------|
| `rules/*.md` | 규칙별 상세 설명·잘못된/올바른 예시 |
| `SKILL.md` | 카테고리·규칙 목록·Quick Reference |
| `AGENTS.md` | 전체 규칙을 한 문서로 모은 컴파일 결과 (원본 저장소에서 생성) |
| `metadata.json` | 버전·출처 메타데이터 |

코드 작성·리뷰 시에는 **실무 가이드**로 흐름을 잡고, 필요할 때만 `rules/` 안의 해당 규칙 파일을 열어서 보면 됩니다.
