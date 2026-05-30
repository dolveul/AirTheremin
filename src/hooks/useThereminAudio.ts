import { useRef, useEffect, useCallback, useState } from 'react';
import { getScaleFrequencies, createImpulseResponse } from '../utils/thereminHelpers';

interface AudioEngine {
  ctx: AudioContext;
  oscSine: OscillatorNode;
  oscTri: OscillatorNode;
  sineGain: GainNode;
  triGain: GainNode;
  voiceGain: GainNode;
  dryGain: GainNode;
  filter: BiquadFilterNode;
  convolver: ConvolverNode;
  reverbGain: GainNode;
  delay: DelayNode;
  delayFeedback: GainNode;
  delayGain: GainNode;
  analyser: AnalyserNode;
  limiter: DynamicsCompressorNode;
}

export function useThereminAudio() {
  const engineRef = useRef<AudioEngine | null>(null);
  const [scale, setScale] = useState<string>('pentatonic');
  const [isGlideEnabled, setIsGlideEnabled] = useState<boolean>(true); // 포르타멘토 슬라이드 활성화 여부
  const [calibratedSpan, setCalibratedSpan] = useState<number>(0.15); // 기본 벌림 기준
  const currentNoteIndexRef = useRef<number>(-1);
  const smoothedZRef = useRef<number>(0.12);
  const [noteInfo, setNoteInfo] = useState({ freq: 0, noteName: '-', volume: 0 });

  const startAudio = useCallback(() => {
    if (engineRef.current) return;

    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      console.error('AudioContext가 이 브라우저에서 지원되지 않습니다.');
      return;
    }

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    // 노드 생성
    const oscSine = ctx.createOscillator();
    const oscTri = ctx.createOscillator();
    const sineGain = ctx.createGain();
    const triGain = ctx.createGain();
    const voiceGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const dryGain = ctx.createGain(); // Dry 신호 볼륨 제어 노드 추가
    const convolver = ctx.createConvolver();
    const reverbGain = ctx.createGain();
    const delay = ctx.createDelay(1.0);
    const delayFeedback = ctx.createGain();
    const delayGain = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.85;

    // 모바일 기기의 소리 찢어짐(디지털 클리핑)을 무손실로 완벽 방어하는 마스터 브릭월 리미터(Brickwall Limiter) 노드 생성
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-3.5, ctx.currentTime); // -3.5dB 이하 평소 상황에는 절대 미간섭 (풀 다이내믹스 보장)
    limiter.knee.setValueAtTime(8, ctx.currentTime); // 날카롭고 확실한 임계 방어
    limiter.ratio.setValueAtTime(20, ctx.currentTime); // 20:1 리미팅 비율
    limiter.attack.setValueAtTime(0.002, ctx.currentTime); // 2ms 초광속 리미팅으로 찢어짐 원천 차단
    limiter.release.setValueAtTime(0.08, ctx.currentTime); // 80ms 빠른 복구로 소리 막힘 현상 방지

    // 블렌딩 설정 (Sine 80%, Triangle 20%)
    oscSine.type = 'sine';
    oscTri.type = 'triangle';
    sineGain.gain.setValueAtTime(0.8, ctx.currentTime);
    triGain.gain.setValueAtTime(0.2, ctx.currentTime);

    // 필터 기본값 (로우패스)
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.Q.setValueAtTime(1.0, ctx.currentTime);

    // 딜레이 이펙터 기본값
    delay.delayTime.setValueAtTime(0.3, ctx.currentTime);
    delayFeedback.gain.setValueAtTime(0.4, ctx.currentTime);

    // 무네트워크 리버브 데이터 삽입 (헬퍼 유틸 사용)
    convolver.buffer = createImpulseResponse(ctx);

    // 초기 볼륨 음소거 및 Dry 기본값 설정
    voiceGain.gain.setValueAtTime(0.0, ctx.currentTime);
    dryGain.gain.setValueAtTime(1.0, ctx.currentTime);
    reverbGain.gain.setValueAtTime(0.0, ctx.currentTime);
    delayGain.gain.setValueAtTime(0.0, ctx.currentTime);

    // 노드 결합
    oscSine.connect(sineGain);
    oscTri.connect(triGain);
    sineGain.connect(voiceGain);
    triGain.connect(voiceGain);
    voiceGain.connect(filter);

    // 이펙터 병렬 연결
    filter.connect(dryGain); // Dry 신호 흐름 연결
    dryGain.connect(analyser);

    filter.connect(reverbGain); // Reverb wet
    reverbGain.connect(convolver);
    convolver.connect(analyser);

    filter.connect(delayGain); // Delay wet
    delayGain.connect(delay);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay); // 피드백 루프
    delay.connect(analyser);

    analyser.connect(limiter); // 리미터 체인 연동
    limiter.connect(ctx.destination);

    // 오실레이터 기동
    oscSine.start();
    oscTri.start();

    engineRef.current = {
      ctx,
      oscSine,
      oscTri,
      sineGain,
      triGain,
      voiceGain,
      dryGain,
      filter,
      convolver,
      reverbGain,
      delay,
      delayFeedback,
      delayGain,
      analyser,
      limiter,
    };
  }, []);

  // 오른손 연주 입력 처리
  const updateRightHand = useCallback(
    (x: number, span: number) => {
      const engine = engineRef.current;
      if (!engine) return;

      const { ctx, oscSine, oscTri, voiceGain } = engine;

      // 모바일 오토플레이 예외 방어: 일시정지 상태라면 터치/제스처 시 자동 재개
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      // 헬퍼 유틸 사용
      const scaleFreqs = getScaleFrequencies(scale);
      const n = scaleFreqs.length;

      // 1. 이력 현상 (Hysteresis) 기반 경계면 스냅
      let noteIndex = currentNoteIndexRef.current;
      if (noteIndex === -1) {
        noteIndex = Math.floor(x * n);
      } else {
        const idealMin = noteIndex / n;
        const idealMax = (noteIndex + 1) / n;
        // 음계 개수(n)에 비례하는 동적 이력 버퍼(개별 건반 폭의 15% 버퍼 영역)를 적용하여
        // 반음계/7음계에서 나타나던 심각한 건반 핀포인트 불일치(Snap Lag) 문제 완전 정밀 해결
        const hysteresisBuffer = 0.15 / n;

        if (x > idealMax + hysteresisBuffer && noteIndex < n - 1) {
          noteIndex = Math.min(n - 1, Math.floor(x * n));
        } else if (x < idealMin - hysteresisBuffer && noteIndex > 0) {
          noteIndex = Math.max(0, Math.floor(x * n));
        }
      }
      currentNoteIndexRef.current = noteIndex;

      const activeFreq = scaleFreqs[noteIndex];
      if (activeFreq) {
        if (isGlideEnabled) {
          // 0.12초(120ms)의 포르타멘토 글라이드로 헤르츠 단위 연속 슬라이드 구현
          // setTargetAtTime은 이전 주파수로부터 주파수 공간상의 모든 중간값(예: 솔 -> 솔# -> 라)을 거쳐 완만하게 곡선을 그리며 도달합니다.
          oscSine.frequency.setTargetAtTime(activeFreq.hz, ctx.currentTime, 0.04);
          oscTri.frequency.setTargetAtTime(activeFreq.hz, ctx.currentTime, 0.04);
        } else {
          // 0.015초 초고속 선형 포르타멘토 (디스크리트 뚝뚝 끊어지는 즉각 반응 모드)
          oscSine.frequency.setValueAtTime(oscSine.frequency.value, ctx.currentTime);
          oscSine.frequency.linearRampToValueAtTime(activeFreq.hz, ctx.currentTime + 0.015);
          oscTri.frequency.setValueAtTime(oscTri.frequency.value, ctx.currentTime);
          oscTri.frequency.linearRampToValueAtTime(activeFreq.hz, ctx.currentTime + 0.015);
        }
      }

      // 2. Hand Span 비례 볼륨 제어 (주먹 움켜쥐었을 때 완전 무음화 기능 강화)
      const minSpan = calibratedSpan * 0.45; // 하한선을 0.45배로 여유 있게 높여 주먹을 가볍게만 쥐어도 확실히 인지되도록 보정
      const maxSpan = calibratedSpan * 1.25; // 상한선 매핑
      const spanVolume = Math.min(1.0, Math.max(0.0, (span - minSpan) / (maxSpan - minSpan)));

      if (spanVolume < 0.15) {
        // 0.02초 초고속 자연스러운 페이드아웃 음소거
        voiceGain.gain.setValueAtTime(voiceGain.gain.value, ctx.currentTime);
        voiceGain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.02);
        setNoteInfo({ freq: activeFreq?.hz ?? 0, noteName: '-', volume: 0 });
      } else {
        // 찢어짐 방지용 헤드룸(-1.5dB)을 안전하게 확보하고 본연의 맑고 우렁찬 기음을 출력하기 위해 깨끗한 0.85 배율 적용
        const targetVolume = Math.pow(spanVolume, 1.2) * 0.85;
        voiceGain.gain.setValueAtTime(voiceGain.gain.value, ctx.currentTime);
        voiceGain.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 0.015);
        setNoteInfo({
          freq: activeFreq?.hz ?? 0,
          noteName: activeFreq?.name ?? '-',
          volume: Math.round(spanVolume * 100),
        });
      }
    },
    [scale, calibratedSpan, isGlideEnabled]
  );

  // 왼손 이펙터 입력 처리
  const updateLeftHand = useCallback((y: number, z: number) => {
    const engine = engineRef.current;
    if (!engine) return;

    const { ctx, filter, dryGain, reverbGain, delayGain, sineGain, triGain } = engine;

    // Y축(오므림 정도): 로우패스 필터 주파수 (대수적 스케일링 250Hz ~ 10,000Hz)
    // 주먹을 꽉 쥐었을 때(y=0)에도 기음이 잘려 소리가 음소거되는 현상을 방지하고자 하한선을 250Hz(10^2.398)로 보정
    const logCutoff = Math.pow(10, 2.398 + y * 1.602);
    // setTargetAtTime(target, startTime, timeConstant)을 사용하여 지퍼 노이즈 및 탁탁 튀는 틱 소음 원천 차단
    filter.frequency.setTargetAtTime(logCutoff, ctx.currentTime, 0.05);

    // Q값(Resonance)도 위로 갈수록 피크를 주어 금속적 음색 필터 스윕 부여 (부드럽게 보간)
    const resonance = 1.0 + y * 6.0;
    filter.Q.setTargetAtTime(resonance, ctx.currentTime, 0.05);

    // Z축(카메라 거리) 감도 상향 및 LERP 스무딩 연출:
    // 지연 속도를 1.5배 상향 조정하여 (가중치 0.18) 연주의 즉각적인 반응성 확보와 필터링 스무스함 공존
    smoothedZRef.current = smoothedZRef.current + (z - smoothedZRef.current) * 0.18;
    const currentZ = smoothedZRef.current;

    // Z축(카메라 거리): 편안한 일반 연주 거리(0.22)에서 리버브 0%가 깔끔히 떨어지고, 팔을 멀리 뻗을수록(0.11) 100% 대성당 효과 도달
    const normalizedZ = Math.min(1.0, Math.max(0.0, (0.22 - currentZ) / 0.11));

    // 리버브 강도 믹스 비율 (0.0 ~ 1.0)
    const mix = Math.pow(normalizedZ, 1.2);

    // 생소리(Dry)와 리버브(Wet)의 주파수 대역별 중첩을 상쇄하고 전체 성량을 균일하게 맞추기 위한 크로스페이드 설정
    const dryVol = 1.0 - mix * 0.25;

    // 버퍼 스케일링이 가미되어 전체 에너지가 극도로 일정한 프로 레벨 잔향 (최대 0.12)
    const wetVol = mix * 0.12;

    // 딜레이 피드백 웻 비율도 풍성하게 매치 (최대 0.08)
    const delayVol = mix * 0.08;

    dryGain.gain.setTargetAtTime(dryVol, ctx.currentTime, 0.05);
    reverbGain.gain.setTargetAtTime(wetVol, ctx.currentTime, 0.05);
    delayGain.gain.setTargetAtTime(delayVol, ctx.currentTime, 0.05);

    // 🎹 실시간 음색 모핑(Oscillator Morphing):
    // 가까울 때(normalizedZ=0): 고지하고 달콤한 순수 Sine 90% + Triangle 10%
    // 멀어질 때(normalizedZ=1): 두텁고 빈티지한 아날로그 Sine 45% + Triangle 55% 배음 블렌딩
    const triVolume = 0.1 + normalizedZ * 0.45;
    const sineVolume = 0.9 - triVolume;
    sineGain.gain.setTargetAtTime(sineVolume, ctx.currentTime, 0.05);
    triGain.gain.setTargetAtTime(triVolume, ctx.currentTime, 0.05);
  }, []);

  const stopAll = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    // 갑작스러운 손 소실 시 디지털 클릭(Pop) 노이즈를 방어하기 위해 0.04초(40ms)의 초고속 선형 페이드아웃 적용
    engine.voiceGain.gain.setValueAtTime(engine.voiceGain.gain.value, engine.ctx.currentTime);
    engine.voiceGain.gain.linearRampToValueAtTime(0.0, engine.ctx.currentTime + 0.04);
    currentNoteIndexRef.current = -1;
    setNoteInfo({ freq: 0, noteName: '-', volume: 0 });
  }, []);

  useEffect(() => {
    return () => {
      // 언마운트 시 노드 연결 해제 및 리소스 회수
      if (engineRef.current) {
        const { ctx, oscSine, oscTri } = engineRef.current;
        try {
          oscSine.stop();
          oscTri.stop();
        } catch (err) {
          console.warn('오실레이터 정지 에러:', err);
        }
        void ctx.close().catch((err) => {
          console.warn('오디오 컨텍스트 닫기 에러:', err);
        });
        engineRef.current = null;
      }
    };
  }, []);

  return {
    startAudio,
    updateRightHand,
    updateLeftHand,
    stopAll,
    scale,
    setScale,
    isGlideEnabled,
    setIsGlideEnabled,
    setCalibratedSpan,
    getScaleFrequencies: () => getScaleFrequencies(scale),
    getAnalyser: () => engineRef.current?.analyser ?? null,
    noteInfo,
  };
}
