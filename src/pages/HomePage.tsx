import { useRef, useState } from 'react';
import { useThereminAudio } from '../hooks/useThereminAudio';
import { useHandpose } from '../hooks/useHandpose';
import { useThereminHandposeParser } from '../hooks/useThereminHandposeParser';
import { useThereminCanvas } from '../hooks/useThereminCanvas';

// 기능별 서브 컴포넌트 임포트 (src/components/features/theremin/)
import LandscapeOrientationGuide from '../components/features/theremin/LandscapeOrientationGuide';
import HeaderControlPanel from '../components/features/theremin/HeaderControlPanel';
import EffectorConsole from '../components/features/theremin/EffectorConsole';
import MelodyCore from '../components/features/theremin/MelodyCore';

export default function HomePage() {
  const {
    startAudio,
    updateRightHand,
    updateLeftHand,
    stopAll,
    scale,
    setScale,
    isGlideEnabled,
    setIsGlideEnabled,
    noteInfo,
    getAnalyser,
  } = useThereminAudio();

  const [isAudioStarted, setIsAudioStarted] = useState(false);

  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1. MediaPipe 좌표 분석 커스텀 훅 결합
  const { leftActive, rightActive, leftVal, handleHandResults, rawRightHandRef, rawLeftHandRef } =
    useThereminHandposeParser({
      isAudioStarted,
      updateRightHand,
      updateLeftHand,
      stopAll,
    });

  // 2. 캔버스 2D 파티클 & 오실로스코프 드로잉 훅 결합
  useThereminCanvas({
    bgCanvasRef,
    fgCanvasRef,
    rightActive,
    leftActive,
    rawRightHandRef,
    rawLeftHandRef,
    volume: noteInfo.volume,
    isAudioStarted,
    getAnalyser,
  });

  const { isLoaded, startTracking } = useHandpose({
    onResults: handleHandResults,
    onBorderWarning: () => {},
  });

  // 오디오 시작 버튼 핸들러
  const handleStart = () => {
    startAudio();
    setIsAudioStarted(true);
    if (videoRef.current) {
      startTracking(videoRef.current).catch((err) => {
        console.error('트래킹 구동 에러:', err);
      });
    }

    // 모바일 브라우저 환경에서 하드웨어 가로 모드 잠금 시도 (지원될 경우)
    const screenObj = window.screen as Screen & {
      orientation?: {
        lock?: (orientation: 'landscape') => Promise<void>;
      };
    };
    if (screenObj.orientation && typeof screenObj.orientation.lock === 'function') {
      const lockPromise = screenObj.orientation.lock('landscape');
      void lockPromise.catch(() => {
        console.log('가로 모드 고정은 모바일 단말기/보안 컨텍스트에서만 지원됩니다.');
      });
    }
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#17130f] relative font-sans text-[#d0c5af] select-none">
      {/* 0. 스팀펑크 오리지널 마호가니 원목 질감 배경 플레이트 */}
      <div className="absolute inset-0 mahogany-texture opacity-60 pointer-events-none z-0" />

      {/* 1. 최하단 웹캠 및 비주얼 캔버스 레이어 (트래킹을 위해 백그라운드 구동하되 화면에는 완전히 감춤) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-0 pointer-events-none z-0"
        playsInline
        muted
      />
      {/* Background Canvas: Ambient oscilloscope wave behind panels */}
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Foreground Canvas: Live tracking particles on top of panels */}
      <canvas
        ref={fgCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />

      {/* 3. 중앙 컨트롤 패널 (Steampunk Floating Control Board) */}
      <HeaderControlPanel
        isAudioStarted={isAudioStarted}
        onStart={handleStart}
        scale={scale}
        onChangeScale={setScale}
        isGlideEnabled={isGlideEnabled}
        onToggleGlide={() => setIsGlideEnabled(!isGlideEnabled)}
      />

      {/* 4. 메인 2.5D 스플릿 연주 공간 */}
      <section className="absolute inset-0 pt-16 md:pt-24 pb-3 px-3 md:pb-4 md:px-4 flex gap-3 md:gap-4 flex-row z-20">
        <EffectorConsole leftActive={leftActive} leftVal={leftVal} />
        <MelodyCore
          rightActive={rightActive}
          noteInfo={noteInfo}
          isLoaded={isLoaded}
          isAudioStarted={isAudioStarted}
          scale={scale}
        />
      </section>

      {/* 5. 모바일 가로 모드 유도 오버레이 */}
      <LandscapeOrientationGuide />
    </main>
  );
}
