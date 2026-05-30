# STRUCTURE.md

UI 영역·배치·대략 비율(레이아웃)을 작성한다.
작성 규칙은 [STRUCTURE_SPEC.md](./specs/STRUCTURE_SPEC.md)를 따른다.

---

## UI 구조 (레이아웃·위치·비율)

```text
<theremin-app-shell> — 위치: 전체 화면 (Full Viewport) | 크기: 100vw * 100vh (가로모드 고정)
- webcam-viewport — 위치: 최하단 Absolute 백그라운드 | 크기: 100% * 100% (좌우 미러링 적용, 불투명도 25%)
- visual-particle-canvas — 위치: Webcam 상단 Absolute 레이어 | 크기: 100% * 100% (손가락 입자 잔상 및 음성 파형 렌더링)
- visual-neon-glow — 위치: 화면 최외곽 Absolute 테두리 | 크기: 100% * 100% (화각 이탈 경고 시 네온 엣지 글로우 노출)

- control-panel — 위치: 화면 상단 중앙 Floating | 크기: 가로 80% * 세로 60px
  - btn-start-audio — 위치: control-panel 내부 | 크기: 가로 120px * 세로 40px (최초 오디오 활성화 버튼)
  - btn-align-calibrate — 위치: control-panel 내부 | 크기: 가로 120px * 세로 40px (정렬 및 기본값 세팅 카운트다운 버튼)
  - select-scale-lock — 위치: control-panel 내부 | 크기: 가로 140px * 세로 40px (음계 선택 드롭다운: 크로매틱, 펜타토닉 등)
  - btn-swap-mode — 위치: control-panel 내부 | 크기: 가로 110px * 세로 40px (오른손/왼손 영역 반전 토글 버튼)

- play-zone-wrapper — 위치: control-panel 아래 Flex 컨테이너 | 크기: 100vw * calc(100vh - 60px)
  - left-play-zone — 위치: 좌측 분할 영역 (기본: 이펙터 영역) | 비율: 전체 폭의 25% * 높이 100%
    - left-status — 위치: left-play-zone 상단 | 크기: 100% * 40px (왼손 감지 활성 상태 텍스트)
    - left-reverb-bar — 위치: left-play-zone 내부 세로형 바 | 크기: 폭 15px * 높이 60% (Z축 연동 리버브 Wet 수치 비주얼라이저)
    - left-filter-bar — 위치: left-play-zone 내부 세로형 바 | 크기: 폭 15px * 높이 60% (Y축 연동 필터 컷오프 수치 비주얼라이저)

  - right-play-zone — 위치: 우측 분할 영역 (기본: 연주 영역) | 비율: 전체 폭의 75% * 높이 100%
    - right-status — 위치: right-play-zone 상단 | 크기: 100% * 40px (오른손 감지 및 손 움켜쥐기 상태 텍스트)
    - right-pitch-grid — 위치: right-play-zone 중앙 격자 | 크기: 100% * 80% (옥타브 및 선택 음계의 건반식 가이드 격자 레이아웃)
    - right-volume-meter — 위치: right-play-zone 우측 끝 세로형 바 | 크기: 폭 20px * 높이 70% (손 벌림 비율 연동 볼륨 실시간 게이지)
```
