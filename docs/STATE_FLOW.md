# STATE_FLOW.md

AI가 상태·흐름·파일 작업 지도를 유지하는 문서.
작성 규칙은 [STATE_FLOW_SPEC.md](./specs/STATE_FLOW_SPEC.md)를 따른다.

---

## 0) 빠른 라우팅 맵 (항상 최상단 유지)

| 지시/키워드                     | 1차 Read                        | 1차 Change                      | 2차 후보                           |
| ------------------------------- | ------------------------------- | ------------------------------- | ---------------------------------- |
| 오디오 셋업 / 오실레이터        | `src/hooks/useThereminAudio.ts` | `src/hooks/useThereminAudio.ts` | `src/pages/HomePage.tsx`           |
| 손 트래킹 / 웹캠 / 미디어파이프 | `src/hooks/useHandpose.ts`      | `src/hooks/useHandpose.ts`      | `src/pages/HomePage.tsx`           |
| 스무딩 필터 / One Euro          | `src/utils/oneEuroFilter.ts`    | `src/utils/oneEuroFilter.ts`    | `src/hooks/useHandpose.ts`         |
| 캘리브레이션 / 셋업 컨트롤      | `src/pages/HomePage.tsx`        | `src/pages/HomePage.tsx`        | `src/components/layout/Navbar.tsx` |
| 좌우 반전 / 스케일 락           | `src/pages/HomePage.tsx`        | `src/pages/HomePage.tsx`        | `src/hooks/useThereminAudio.ts`    |

---

## 1) 파일 인벤토리 (핵심)

| File                            | Owns state                                                                                          | Sets/updates                                               | Reads/consumes                     | Hooks                                 | Side effects                              | Related IDs                                                                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------- | ------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/pages/HomePage.tsx`        | `isAudioActive`, `isSwapped`, `selectedScale`, `calibrateState`, `calibrationData`, `handsDetected` | 사용자 인터랙션 (Click, Change), 웹캠 감지 완료 이벤트     | UI 렌더링, 자식 컴포넌트 렌더링    | `useThereminAudio`, `useHandpose`     | Web캠 스트림 시작, AudioContext 활성 경고 | `theremin-app-shell`, `control-panel`, `btn-start-audio`, `btn-align-calibrate`, `select-scale-lock`, `btn-swap-mode`, `visual-neon-glow`, `left-status`, `right-status` |
| `src/hooks/useThereminAudio.ts` | 오실레이터 주파수, Gain 볼륨, Reverb/Filter 노드 참조                                               | `right-play-zone` X/Y/Span 입력, `left-play-zone` Y/Z 입력 | Audio 파이프라인 제어              | `useRef` 기반 오디오 노드 참조 유지   | Web Audio API 출력, 노이즈 필터링         | `right-volume-meter`, `right-pitch-grid`, `left-reverb-bar`, `left-filter-bar`                                                                                           |
| `src/hooks/useHandpose.ts`      | 웹캠 스트림, 손 랜드마크 데이터, 인식 성공 여부                                                     | 웹캠 비전 프레임별 감지 업데이트                           | 캔버스 드로잉, 소리 제어 입력 전달 | `useRef` 기반 MediaPipe 인스턴스 유지 | 웹캠 디바이스 캡처, MediaPipe 추적(Wasm)  | `webcam-viewport`, `visual-particle-canvas`                                                                                                                              |
| `src/utils/oneEuroFilter.ts`    | 필터 상태값 (이전 x, dx)                                                                            | X축 좌표 업데이트 마다 갱신                                | 스무딩 좌표 반환                   | 없음                                  | 상태 메모리 유지                          | `right-play-zone` (Pitch X축 필터링)                                                                                                                                     |

---

## 2) 상태·훅 흐름 블록 (필요 최소만)

### `ThereminVoiceState`

- **Source of truth**: `src/hooks/useThereminAudio.ts`
- **Updated by**: `right-play-zone` (오른손 X축 이동으로 주파수, Span 벌림으로 Volume Gain)
- **Flows to**: Web Audio API `AudioContext` -> 오디오 노드 아웃풋
- **Read-only consumers**: `right-volume-meter` (게이지 렌더링용), `right-pitch-grid` (활성 음 강조용)
- **Side effects**: 오디오 신호 실시간 변경 (Linear/Exponential Ramp 보간, 팝 잡음 소거 envelope)
- **Read first**: `src/hooks/useThereminAudio.ts`
- **Change first**: `src/hooks/useThereminAudio.ts`

### `ThereminEffectsState`

- **Source of truth**: `src/hooks/useThereminAudio.ts`
- **Updated by**: `left-play-zone` (왼손 Y축 이동으로 lowpass filter cutoff, Z축 크기로 reverb wet)
- **Flows to**: Web Audio BiquadFilterNode 및 Reverb Feedback Loop Node
- **Read-only consumers**: `left-reverb-bar` 및 `left-filter-bar` (실시간 이펙터 비주얼라이저)
- **Side effects**: 공간 딜레이 피드백 가변 및 필터 차단 주파수 갱신
- **Read first**: `src/hooks/useThereminAudio.ts`
- **Change first**: `src/hooks/useThereminAudio.ts`

### `HandposeTrackingState`

- **Source of truth**: `src/hooks/useHandpose.ts`
- **Updated by**: 웹캠 비디오 프레임별 감지 연산 (MediaPipe Wasm)
- **Flows to**: `src/pages/HomePage.tsx` (손 랜드마크 좌표 콜백 제공), `visual-particle-canvas` (잔상 드로잉)
- **Read-only consumers**: `visual-particle-canvas`, `visual-neon-glow` (화각 판단용)
- **Side effects**: 웹캠 프레임 캡처 루프 가동, CPU/GPU 비전 연산
- **Read first**: `src/hooks/useHandpose.ts`
- **Change first**: `src/hooks/useHandpose.ts`

---

## 3) 작업 후 갱신 체크 (AI용)

- [x] 상태 소유 위치 변경
- [x] 업데이트 트리거 변경
- [x] 훅 의존/소비 변경
- [x] API/스토리지/구독 부수효과 변경
- [x] 1차 Read/Change 파일 변경
