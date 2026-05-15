---
description: 프로젝트 문서 파이프라인과 STATE_FLOW(AI 작업 지도) 규칙
alwaysApply: true
---

# 프로젝트 문서 (베이스 템플릿)

## 사람이 채우는 순서

1. **docs/PLAN.md** — 기획·요구사항
2. **docs/STRUCTURE.md** — UI 영역·배치·대략 비율 (레이아웃)
3. **docs/FUNCTION.md** — STRUCTURE ID와 맞춘 요소별 기능·동작
4. **docs/DESIGN.md** — 디자인 철학·토큰·Stitch 등 참고 코드

## AI가 유지하는 문서

- **docs/STATE_FLOW.md** — PLAN·STRUCTURE·FUNCTION·DESIGN과 코드를 반영해 **상태·흐름**과 **어떤 파일을 읽고·고칠지**를 짧은 표/섹션으로 유지한다. 지시 이행 시 전역 탐색 없이 후보 파일을 좁히기 위한 **AI 우선 작업 지도**다.
- **저토큰 원칙**: STATE_FLOW는 긴 설명 대신 `빠른 라우팅 맵`, `파일 인벤토리`, `Read/Change` 중심으로 유지한다.

## 규칙 문서 우선

- 문서 작성 규칙의 진입점은 **docs/DOCS_SPEC.md**이며, 상세 규칙은 **docs/specs/\*\_SPEC.md**를 따른다.
- `PLAN/STRUCTURE/FUNCTION/DESIGN/STATE_FLOW`는 실제 프로젝트 내용 작성용으로 유지하고, 상세 규칙은 넣지 않는다.
- 실사용 문서와 규칙이 충돌하거나 누락되면 `docs/specs/\*_SPEC.md`를 기준으로 정렬한다.

## 작업 시

- 레이아웃·비율은 STRUCTURE, 동작은 FUNCTION, 시각 규칙은 DESIGN을 우선한다.
- 상태·데이터 흐름·파일 매핑은 STATE_FLOW를 우선한다. 관련 구현을 바꾸면 같은 작업에서 STATE_FLOW를 갱신한다.
- 코드 작업 종료 전 `docs/specs/STATE_FLOW_SPEC.md`의 5개 갱신 트리거를 반드시 점검한다.
- 5개 중 하나라도 해당하면 `docs/STATE_FLOW.md`를 같은 작업에서 갱신한다.
- 해당 없음이면 최종 응답에 "STATE_FLOW 영향 없음(점검 완료)"를 명시한다.

## 커밋/푸시 인코딩 규칙

- 이 저장소에서 한글 커밋은 허용한다.
- 한글 커밋 시 `git commit -m` 대신 `commit-msg.txt`(UTF-8) + `scripts/commit-utf8.ps1` 경유를 사용한다.
- `commit-msg.txt`는 에디터에서 직접 작성/저장하고, 셸 문자열 생성 방식은 사용하지 않는다.
- 사용자가 푸시를 지시하면 위 절차로 커밋을 만든 뒤 푸시한다.
