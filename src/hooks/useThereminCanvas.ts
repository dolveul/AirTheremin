import { useEffect } from 'react';
import type { MediaPipeLandmark } from '../types/theremin';

interface CanvasProps {
  bgCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  fgCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  rightActive: boolean;
  leftActive: boolean;
  rawRightHandRef: React.RefObject<{
    x: number;
    y: number;
    span: number;
    landmarks?: MediaPipeLandmark[];
  } | null>;
  rawLeftHandRef: React.RefObject<{
    x: number;
    y: number;
    landmarks?: MediaPipeLandmark[];
  } | null>;
  volume: number;
  isAudioStarted: boolean;
  getAnalyser: () => AnalyserNode | null;
}

const HAND_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4], // 엄지
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8], // 검지
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12], // 중지
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16], // 약지
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20], // 새끼
  [5, 9],
  [9, 13],
  [13, 17], // 손가락 기저 관절 연결선
];

export function useThereminCanvas({
  bgCanvasRef,
  fgCanvasRef,
  rightActive,
  leftActive,
  rawRightHandRef,
  rawLeftHandRef,
  volume,
  isAudioStarted,
  getAnalyser,
}: CanvasProps) {
  useEffect(() => {
    let animId: number;
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const bgCtx = bgCanvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d');
    if (!bgCtx || !fgCtx) return;

    const resize = () => {
      const parentW = bgCanvas.parentElement?.clientWidth || window.innerWidth;
      const parentH = bgCanvas.parentElement?.clientHeight || window.innerHeight;

      bgCanvas.width = parentW;
      bgCanvas.height = parentH;
      fgCanvas.width = parentW;
      fgCanvas.height = parentH;
    };
    resize();
    window.addEventListener('resize', resize);

    // 연주 손끝 및 중심 가이드 대형 분출 파티클 배열
    const particles: {
      x: number;
      y: number;
      alpha: number;
      size: number;
      color?: string;
      shadowColor?: string;
    }[] = [];

    // 관절 노드에서 발생해 무게중심 코어를 향해 흡수되는 미세 중력 stardust 파티클
    const gravityParticles: {
      x: number;
      y: number;
      alpha: number;
      size: number;
      speed: number;
      color: string;
    }[] = [];

    // 파장의 시간차 극강 부드러움을 위한 리퀴드 글라스 보간용 Y배열
    let smoothYArray: number[] = [];

    const draw = () => {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);

      // (A-0) 양손의 3차원 볼륨 홀로그램 실루엣(Volumetric Neon Hologram Hand) 그리기
      if (rightActive && rawRightHandRef.current?.landmarks) {
        fgCtx.save();
        fgCtx.lineCap = 'round';
        fgCtx.lineJoin = 'round';

        const landmarks = rawRightHandRef.current.landmarks;

        // 1단계: 가장 은은한 외부 네온 가스 아우라 (두께 14px)
        fgCtx.strokeStyle = 'rgba(242, 202, 80, 0.05)';
        fgCtx.lineWidth = 14;
        fgCtx.beginPath();
        HAND_CONNECTIONS.forEach(([i, j]) => {
          const ptA = landmarks[i];
          const ptB = landmarks[j];
          if (ptA && ptB) {
            fgCtx.moveTo((1 - ptA.x) * fgCanvas.width, ptA.y * fgCanvas.height);
            fgCtx.lineTo((1 - ptB.x) * fgCanvas.width, ptB.y * fgCanvas.height);
          }
        });
        fgCtx.stroke();

        // 2단계: 볼륨감을 선사하는 중간 충전선 (두께 7px)
        fgCtx.strokeStyle = 'rgba(242, 202, 80, 0.16)';
        fgCtx.lineWidth = 7;
        fgCtx.beginPath();
        HAND_CONNECTIONS.forEach(([i, j]) => {
          const ptA = landmarks[i];
          const ptB = landmarks[j];
          if (ptA && ptB) {
            fgCtx.moveTo((1 - ptA.x) * fgCanvas.width, ptA.y * fgCanvas.height);
            fgCtx.lineTo((1 - ptB.x) * fgCanvas.width, ptB.y * fgCanvas.height);
          }
        });
        fgCtx.stroke();

        // 3단계: 중심을 관통하는 밝은 전선 코어 (두께 2px)
        fgCtx.strokeStyle = 'rgba(242, 202, 80, 0.45)';
        fgCtx.lineWidth = 2.0;
        fgCtx.beginPath();
        HAND_CONNECTIONS.forEach(([i, j]) => {
          const ptA = landmarks[i];
          const ptB = landmarks[j];
          if (ptA && ptB) {
            fgCtx.moveTo((1 - ptA.x) * fgCanvas.width, ptA.y * fgCanvas.height);
            fgCtx.lineTo((1 - ptB.x) * fgCanvas.width, ptB.y * fgCanvas.height);
          }
        });
        fgCtx.stroke();

        // 입체적인 관절 노드 구체 구형 그리기
        landmarks.forEach((pt) => {
          if (pt) {
            const x = (1 - pt.x) * fgCanvas.width;
            const y = pt.y * fgCanvas.height;
            // 관절 외부 은은한 글로우
            fgCtx.beginPath();
            fgCtx.arc(x, y, 6.5, 0, Math.PI * 2);
            fgCtx.fillStyle = 'rgba(242, 202, 80, 0.1)';
            fgCtx.fill();
            // 관절 내부 밝은 코어
            fgCtx.beginPath();
            fgCtx.arc(x, y, 2.5, 0, Math.PI * 2);
            fgCtx.fillStyle = 'rgba(242, 202, 80, 0.65)';
            fgCtx.fill();
          }
        });
        fgCtx.restore();

        // 🌟 오른손 정수 에너지 생성: 5개 손가락 끝(Tips)으로부터 무게중심을 향해 은은하게 수렴하는 스타더스트 방출
        const fingerTips = [4, 8, 12, 16, 20];
        fingerTips.forEach((tipIdx) => {
          const tip = landmarks[tipIdx];
          if (tip && Math.random() < 0.55) {
            gravityParticles.push({
              x: (1 - tip.x) * fgCanvas.width,
              y: tip.y * fgCanvas.height,
              alpha: 1.0,
              size: 1.2 + Math.random() * 3.5,
              speed: 0.06 + Math.random() * 0.09, // 흡입 매핑 속도
              color: 'rgba(242, 202, 80, 0.85)',
            });
          }
        });

        // 🌟 오른손 중심점(Centroid)을 영롱하게 박동하는 마그네틱 볼륨 코어로 시각화
        const cx = rawRightHandRef.current.x * fgCanvas.width;
        const cy = rawRightHandRef.current.y * fgCanvas.height;
        // 볼륨(음량 세기)과 유기적으로 반응하여 크기가 부풀고 숨쉬는 지름 설계
        const baseRadius = 14 + (volume / 100) * 18;

        fgCtx.save();

        const grad = fgCtx.createRadialGradient(cx, cy, 2, cx, cy, baseRadius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.25, 'rgba(242, 202, 80, 0.85)');
        grad.addColorStop(0.6, 'rgba(242, 202, 80, 0.3)');
        grad.addColorStop(1, 'rgba(242, 202, 80, 0)');

        fgCtx.beginPath();
        fgCtx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
        fgCtx.fillStyle = grad;
        fgCtx.fill();
        fgCtx.restore();
      }

      if (leftActive && rawLeftHandRef.current?.landmarks) {
        fgCtx.save();
        fgCtx.lineCap = 'round';
        fgCtx.lineJoin = 'round';

        const landmarks = rawLeftHandRef.current.landmarks;

        // 1단계: 가장 은은한 네온 가스 아우라 (두께 14px)
        fgCtx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
        fgCtx.lineWidth = 14;
        fgCtx.beginPath();
        HAND_CONNECTIONS.forEach(([i, j]) => {
          const ptA = landmarks[i];
          const ptB = landmarks[j];
          if (ptA && ptB) {
            fgCtx.moveTo((1 - ptA.x) * fgCanvas.width, ptA.y * fgCanvas.height);
            fgCtx.lineTo((1 - ptB.x) * fgCanvas.width, ptB.y * fgCanvas.height);
          }
        });
        fgCtx.stroke();

        // 2단계: 볼륨감을 선사하는 중간 충전선 (두께 7px)
        fgCtx.strokeStyle = 'rgba(6, 182, 212, 0.16)';
        fgCtx.lineWidth = 7;
        fgCtx.beginPath();
        HAND_CONNECTIONS.forEach(([i, j]) => {
          const ptA = landmarks[i];
          const ptB = landmarks[j];
          if (ptA && ptB) {
            fgCtx.moveTo((1 - ptA.x) * fgCanvas.width, ptA.y * fgCanvas.height);
            fgCtx.lineTo((1 - ptB.x) * fgCanvas.width, ptB.y * fgCanvas.height);
          }
        });
        fgCtx.stroke();

        // 3단계: 중심을 관통하는 밝은 전선 코어 (두께 2px)
        fgCtx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
        fgCtx.lineWidth = 2.0;
        fgCtx.beginPath();
        HAND_CONNECTIONS.forEach(([i, j]) => {
          const ptA = landmarks[i];
          const ptB = landmarks[j];
          if (ptA && ptB) {
            fgCtx.moveTo((1 - ptA.x) * fgCanvas.width, ptA.y * fgCanvas.height);
            fgCtx.lineTo((1 - ptB.x) * fgCanvas.width, ptB.y * fgCanvas.height);
          }
        });
        fgCtx.stroke();

        // 입체적인 관절 노드 구체 구형 그리기
        landmarks.forEach((pt) => {
          if (pt) {
            const x = (1 - pt.x) * fgCanvas.width;
            const y = pt.y * fgCanvas.height;
            // 관절 외부 은은한 글로우
            fgCtx.beginPath();
            fgCtx.arc(x, y, 6.5, 0, Math.PI * 2);
            fgCtx.fillStyle = 'rgba(6, 182, 212, 0.1)';
            fgCtx.fill();
            // 관절 내부 밝은 코어
            fgCtx.beginPath();
            fgCtx.arc(x, y, 2.5, 0, Math.PI * 2);
            fgCtx.fillStyle = 'rgba(6, 182, 212, 0.65)';
            fgCtx.fill();
          }
        });
        fgCtx.restore();

        // 🌟 왼손 정수 에너지 생성: 5개 손가락 끝(Tips)으로부터 무게중심을 향해 은은하게 수렴하는 스타더스트 방출
        const fingerTips = [4, 8, 12, 16, 20];
        fingerTips.forEach((tipIdx) => {
          const tip = landmarks[tipIdx];
          if (tip && Math.random() < 0.55) {
            gravityParticles.push({
              x: (1 - tip.x) * fgCanvas.width,
              y: tip.y * fgCanvas.height,
              alpha: 1.0,
              size: 1.2 + Math.random() * 3.5,
              speed: 0.06 + Math.random() * 0.09,
              color: 'rgba(6, 182, 212, 0.85)',
            });
          }
        });

        // 🌟 왼손 중심점(Centroid)을 영롱하게 박동하는 웜홀 필터 코어로 시각화 (호흡 주기 이펙팅)
        const lcx = rawLeftHandRef.current.x * fgCanvas.width;
        const lcy = rawLeftHandRef.current.y * fgCanvas.height;
        const timeBreathe = Math.sin(performance.now() / 140) * 3;
        const leftBaseRadius = 16 + timeBreathe;

        fgCtx.save();

        const lGrad = fgCtx.createRadialGradient(lcx, lcy, 2, lcx, lcy, leftBaseRadius);
        lGrad.addColorStop(0, '#ffffff');
        lGrad.addColorStop(0.25, 'rgba(6, 182, 212, 0.85)');
        lGrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.3)');
        lGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        fgCtx.beginPath();
        fgCtx.arc(lcx, lcy, leftBaseRadius, 0, Math.PI * 2);
        fgCtx.fillStyle = lGrad;
        fgCtx.fill();
        fgCtx.restore();
      }

      // (A-0.5) 🌟 중력 인력 파티클 모임 연출 물리 시뮬레이션 및 렌더링
      for (let i = gravityParticles.length - 1; i >= 0; i--) {
        const gp = gravityParticles[i];

        // 대상 손의 실시간 최신 무게중심 좌표 설정
        let targetX = fgCanvas.width / 2;
        let targetY = fgCanvas.height / 2;
        let active = false;

        if (gp.color.includes('242')) {
          if (rightActive && rawRightHandRef.current) {
            targetX = rawRightHandRef.current.x * fgCanvas.width;
            targetY = rawRightHandRef.current.y * fgCanvas.height;
            active = true;
          }
        } else {
          if (leftActive && rawLeftHandRef.current) {
            targetX = rawLeftHandRef.current.x * fgCanvas.width;
            targetY = rawLeftHandRef.current.y * fgCanvas.height;
            active = true;
          }
        }

        // 중심점을 향해 중력 가속 끌어당김
        gp.x += (targetX - gp.x) * gp.speed;
        gp.y += (targetY - gp.y) * gp.speed;
        gp.alpha -= 0.015; // 모여들면서 점진적으로 페이드 아웃

        const dx = targetX - gp.x;
        const dy = targetY - gp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 손이 사라졌거나, 투명도가 다했거나, 무게중심 반경 8px 이내 도달 시 코어 속으로 온전히 소화 소멸
        if (!active || gp.alpha <= 0 || dist < 8) {
          gravityParticles.splice(i, 1);
          continue;
        }

        fgCtx.save();
        fgCtx.globalAlpha = gp.alpha;
        fgCtx.beginPath();
        fgCtx.arc(gp.x, gp.y, gp.size, 0, Math.PI * 2);
        fgCtx.fillStyle = gp.color;
        fgCtx.fill();
        fgCtx.restore();
      }

      // (A-1) 오른손 연주 가이드 파티클 분출 (전경 캔버스)
      if (rightActive && rawRightHandRef.current && volume > 0) {
        const px = rawRightHandRef.current.x * fgCanvas.width;
        const py = rawRightHandRef.current.y * fgCanvas.height;
        particles.push({
          x: px,
          y: py,
          alpha: 1.0,
          size: 3 + Math.random() * 5,
          color: '#f59e0b',
          shadowColor: '#d97706',
        });
      }

      // (A-2) 왼손 이펙터 가이드 파티클 분출 (전경 캔버스)
      if (leftActive && rawLeftHandRef.current) {
        const lpx = rawLeftHandRef.current.x * fgCanvas.width;
        const lpy = rawLeftHandRef.current.y * fgCanvas.height;
        particles.push({
          x: lpx,
          y: lpy,
          alpha: 0.8,
          size: 4 + Math.random() * 4,
          color: '#06b6d4',
          shadowColor: '#06b6d4',
        });
      }

      // 전경 캔버스에 파티클 렌더링
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= 0.04;
        p.size *= 0.95;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        fgCtx.save();
        fgCtx.globalAlpha = p.alpha;
        fgCtx.beginPath();
        fgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fgCtx.fillStyle = p.color || '#f59e0b';
        fgCtx.fill();
        fgCtx.restore();
      }

      // (B) 전경 캔버스에 "오른손 영역(MelodyCore)"에 국한된 부드럽고 아주 은은한 액체 파형 그리기 (z-30 레이어로 위로 올라옴)
      const analyser = getAnalyser();
      if (analyser && isAudioStarted) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        // 로컬 오버플로우 방지 및 오른손 연주 영역 가로 범위 설정
        const startX = fgCanvas.width * 0.29;
        const endX = fgCanvas.width * 0.975;
        const waveWidth = endX - startX;

        const centerY = fgCanvas.height / 2;

        if (smoothYArray.length !== bufferLength) {
          smoothYArray = Array.from({ length: bufferLength }, () => centerY);
        }

        fgCtx.save();
        fgCtx.beginPath();
        fgCtx.lineWidth = 4.8; // 더 두껍고 기품 있는 파형 라인
        fgCtx.strokeStyle = 'rgba(242, 202, 80, 0.38)'; // 밝기를 높여 blur 없이도 선명하게 글로우 표현

        const sliceWidth = waveWidth / bufferLength;
        let x = startX;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          // 세로 진폭을 감쇄시키는 대신 1.35배 대폭 확장하여 극도로 격렬하고 힘찬 액체 파동 연출
          const targetY = centerY + (v - 1.0) * centerY * 1.35;
          // 보간 반응 속도를 약 2배 상향 (0.60대 보간)하여, 고주파 파동에 즉각적이고 번개처럼 요동치는 파형 선사
          smoothYArray[i] = smoothYArray[i] * 0.6 + targetY * 0.4;
          const y = smoothYArray[i];

          if (i === 0) {
            fgCtx.moveTo(x, y);
          } else {
            fgCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        fgCtx.lineTo(endX, centerY);
        fgCtx.stroke();
        fgCtx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [
    rightActive,
    leftActive,
    getAnalyser,
    isAudioStarted,
    volume,
    bgCanvasRef,
    fgCanvasRef,
    rawRightHandRef,
    rawLeftHandRef,
  ]);
}
