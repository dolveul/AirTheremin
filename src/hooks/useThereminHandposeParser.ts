import { useState, useRef, useEffect, useCallback } from 'react';
import { OneEuroFilter } from '../utils/oneEuroFilter';
import type { MediaPipeResults, MediaPipeLandmark } from '../types/theremin';

interface HandposeParserProps {
  isAudioStarted: boolean;
  updateRightHand: (x: number, span: number) => void;
  updateLeftHand: (y: number, z: number) => void;
  stopAll: () => void;
}

export function useThereminHandposeParser({
  isAudioStarted,
  updateRightHand,
  updateLeftHand,
  stopAll,
}: HandposeParserProps) {
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);
  const [leftVal, setLeftVal] = useState({ reverb: 0, filter: 50 });
  const [borderWarning, setBorderWarning] = useState(false);

  // 미러링된 손 랜드마크 데이터 저장용 Ref
  const rawRightHandRef = useRef<{
    x: number;
    y: number;
    span: number;
    landmarks?: MediaPipeLandmark[];
  } | null>(null);
  const rawLeftHandRef = useRef<{
    x: number;
    y: number;
    landmarks?: MediaPipeLandmark[];
  } | null>(null);
  const smoothedLeftZRef = useRef<number>(0.12);
  const oneEuroFilterRef = useRef(new OneEuroFilter(2.0, 0.08));

  // 미디어파이프 이벤트 루프 클로저 바인딩용 최신 상태 Ref 복제
  const isAudioStartedRef = useRef(false);

  // 오디오 연산 콜백용 최신 참조 Ref 복제
  const updateRightHandRef = useRef(updateRightHand);
  const updateLeftHandRef = useRef(updateLeftHand);
  const stopAllRef = useRef(stopAll);

  // 실시간 Props 갱신 Ref 동기화
  useEffect(() => {
    isAudioStartedRef.current = isAudioStarted;
  }, [isAudioStarted]);

  useEffect(() => {
    updateRightHandRef.current = updateRightHand;
  }, [updateRightHand]);

  useEffect(() => {
    updateLeftHandRef.current = updateLeftHand;
  }, [updateLeftHand]);

  useEffect(() => {
    stopAllRef.current = stopAll;
  }, [stopAll]);

  // 미디어파이프 인식 좌표 처리 콜백
  const handleHandResults = useCallback((results: MediaPipeResults) => {
    let hasLeft = false;
    let hasRight = false;
    let rightHandData: {
      x: number;
      y: number;
      span: number;
      landmarks?: MediaPipeLandmark[];
    } | null = null;
    let leftHandData: { y: number; z: number } | null = null;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // 감지된 손들을 wristX (미러링된 X좌표) 기준 오름차순으로 정렬
      const sortedHands = [...results.multiHandLandmarks]
        .map((landmarks) => {
          const wrist = landmarks[0];
          const wristX = wrist ? 1 - wrist.x : 0.5;
          return { landmarks, wristX };
        })
        .sort((a, b) => a.wristX - b.wristX);

      if (sortedHands.length === 2) {
        // [두 손 모두 인식된 경우]: 화면에서 왼쪽에 있는 손을 무조건 왼손(이펙터), 오른쪽에 있는 손을 오른손(연주)으로 분류
        const leftHandObj = sortedHands[0];
        const rightHandObj = sortedHands[1];

        // 왼손 처리
        const leftWrist = leftHandObj.landmarks[0];
        const leftMidKnuckle = leftHandObj.landmarks[9];
        const leftThumb = leftHandObj.landmarks[4];
        const leftPinky = leftHandObj.landmarks[20];
        const leftIndexTip = leftHandObj.landmarks[8];
        const leftIndexMCP = leftHandObj.landmarks[5];
        const leftMiddleTip = leftHandObj.landmarks[12];
        const leftMiddleMCP = leftHandObj.landmarks[9];
        const leftRingTip = leftHandObj.landmarks[16];
        const leftRingMCP = leftHandObj.landmarks[13];
        const leftPinkyMCP = leftHandObj.landmarks[17];

        if (
          leftWrist &&
          leftMidKnuckle &&
          leftThumb &&
          leftPinky &&
          leftIndexTip &&
          leftIndexMCP &&
          leftMiddleTip &&
          leftMiddleMCP &&
          leftRingTip &&
          leftRingMCP &&
          leftPinkyMCP
        ) {
          hasLeft = true;
          // Z축 (Reverb/Tone): 실제 카메라와의 2D 평면 거리를 산정하기 위해 0번(손목)과 9번(중지 MCP) 사이의 거리를 계산
          const distZ = Math.sqrt(
            Math.pow(leftWrist.x - leftMidKnuckle.x, 2) +
              Math.pow(leftWrist.y - leftMidKnuckle.y, 2)
          );

          // Y축 (Filter): 왼손 펼침 정도 (Openness) 측정하여 Y 값으로 활용
          const lThumbPinky = Math.sqrt(
            Math.pow(leftThumb.x - leftPinky.x, 2) + Math.pow(leftThumb.y - leftPinky.y, 2)
          );
          const lIndexOpen = Math.sqrt(
            Math.pow(leftIndexTip.x - leftIndexMCP.x, 2) +
              Math.pow(leftIndexTip.y - leftIndexMCP.y, 2)
          );
          const lMiddleOpen = Math.sqrt(
            Math.pow(leftMiddleTip.x - leftMiddleMCP.x, 2) +
              Math.pow(leftMiddleTip.y - leftMiddleMCP.y, 2)
          );
          const lRingOpen = Math.sqrt(
            Math.pow(leftRingTip.x - leftRingMCP.x, 2) + Math.pow(leftRingTip.y - leftRingMCP.y, 2)
          );
          const lPinkyOpen = Math.sqrt(
            Math.pow(leftPinky.x - leftPinkyMCP.x, 2) + Math.pow(leftPinky.y - leftPinkyMCP.y, 2)
          );
          const lAvgOpen = (lIndexOpen + lMiddleOpen + lRingOpen + lPinkyOpen) / 4;
          // Z축 깊이(distZ)와의 상대적 비율을 구함으로써 카메라와의 전후 거리 변동에 철저히 무관한(Scale-Invariant) 펼침 척도 획득
          const rawOpenness = Math.min(lThumbPinky, lAvgOpen * 1.6);
          const ratioOpenness = rawOpenness / Math.max(0.01, distZ);

          // 주먹을 움켜쥘 때(비율 약 0.35)에서 넓게 펼칠 때(비율 약 0.95)까지 0.0 ~ 1.0 매핑
          const leftOpenness = Math.min(1.0, Math.max(0.0, (ratioOpenness - 0.35) / (0.95 - 0.35)));

          leftHandData = { y: leftOpenness, z: distZ };

          // 왼손도 모든 21개 관절의 중심을 무게중심 인식 지점으로 설정
          let leftSumX = 0;
          let leftSumY = 0;
          let leftCount = 0;
          leftHandObj.landmarks.forEach((pt) => {
            if (pt) {
              leftSumX += 1 - pt.x;
              leftSumY += pt.y;
              leftCount++;
            }
          });
          const leftCentroidX = leftCount > 0 ? leftSumX / leftCount : 0.5;
          const leftCentroidY = leftCount > 0 ? leftSumY / leftCount : 0.5;

          rawLeftHandRef.current = {
            x: leftCentroidX,
            y: leftCentroidY,
            landmarks: leftHandObj.landmarks,
          };
        }

        // 오른손 처리: 손의 모든 21개 뼈대 마커(Landmarks)의 수학적 무게중심(Centroid)을 계산.
        // 손바닥의 전반적 안정성을 확보하면서도, 특정 손가락만 움찔거려도 음색/피치가 미세하게 흔들리는(Vibrato) 극도의 유기적 조작계 구현
        let sumX = 0;
        let sumY = 0;
        let count = 0;
        rightHandObj.landmarks.forEach((pt) => {
          if (pt) {
            sumX += 1 - pt.x;
            sumY += pt.y;
            count++;
          }
        });
        const rightX = count > 0 ? sumX / count : 0.5;
        const rightY = count > 0 ? sumY / count : 0.5;

        const thumb = rightHandObj.landmarks[4];
        const pinky = rightHandObj.landmarks[20];
        const indexTip = rightHandObj.landmarks[8];
        const indexMCP = rightHandObj.landmarks[5];
        const middleTip = rightHandObj.landmarks[12];
        const middleMCP = rightHandObj.landmarks[9];
        const ringTip = rightHandObj.landmarks[16];
        const ringMCP = rightHandObj.landmarks[13];
        const pinkyMCP = rightHandObj.landmarks[17];

        if (
          thumb &&
          pinky &&
          indexTip &&
          indexMCP &&
          middleTip &&
          middleMCP &&
          ringTip &&
          ringMCP &&
          pinkyMCP
        ) {
          hasRight = true;
          const thumbPinkyDist = Math.sqrt(
            Math.pow(thumb.x - pinky.x, 2) + Math.pow(thumb.y - pinky.y, 2)
          );
          const indexOpen = Math.sqrt(
            Math.pow(indexTip.x - indexMCP.x, 2) + Math.pow(indexTip.y - indexMCP.y, 2)
          );
          const middleOpen = Math.sqrt(
            Math.pow(middleTip.x - middleMCP.x, 2) + Math.pow(middleTip.y - middleMCP.y, 2)
          );
          const ringOpen = Math.sqrt(
            Math.pow(ringTip.x - ringMCP.x, 2) + Math.pow(ringTip.y - ringMCP.y, 2)
          );
          const pinkyOpen = Math.sqrt(
            Math.pow(pinky.x - pinkyMCP.x, 2) + Math.pow(pinky.y - pinkyMCP.y, 2)
          );
          const avgFingersOpen = (indexOpen + middleOpen + ringOpen + pinkyOpen) / 4;
          const rawSpan = Math.min(thumbPinkyDist, avgFingersOpen * 1.6);
          rightHandData = {
            x: rightX,
            y: rightY,
            span: rawSpan,
            landmarks: rightHandObj.landmarks,
          };
        }
      } else if (sortedHands.length === 1) {
        // [단일 손 인식]: 좌/우 절대 영역 분할 스키마 (오른손 75%, 왼손 25%)
        const hand = sortedHands[0];
        const wrist = hand.landmarks[0];
        if (wrist) {
          const wristX = 1 - wrist.x;
          if (wristX > 0.25) {
            // 오른손 연주 전용 매핑: 손의 21개 마커 전체의 무게중심(Centroid) 계산
            let sumX = 0;
            let sumY = 0;
            let count = 0;
            hand.landmarks.forEach((pt) => {
              if (pt) {
                sumX += 1 - pt.x;
                sumY += pt.y;
                count++;
              }
            });
            const rightX = count > 0 ? sumX / count : 0.5;
            const rightY = count > 0 ? sumY / count : 0.5;

            const thumb = hand.landmarks[4];
            const pinky = hand.landmarks[20];
            const indexTip = hand.landmarks[8];
            const indexMCP = hand.landmarks[5];
            const middleTip = hand.landmarks[12];
            const middleMCP = hand.landmarks[9];
            const ringTip = hand.landmarks[16];
            const ringMCP = hand.landmarks[13];
            const pinkyMCP = hand.landmarks[17];

            if (
              thumb &&
              pinky &&
              indexTip &&
              indexMCP &&
              middleTip &&
              middleMCP &&
              ringTip &&
              ringMCP &&
              pinkyMCP
            ) {
              hasRight = true;
              const thumbPinkyDist = Math.sqrt(
                Math.pow(thumb.x - pinky.x, 2) + Math.pow(thumb.y - pinky.y, 2)
              );
              const indexOpen = Math.sqrt(
                Math.pow(indexTip.x - indexMCP.x, 2) + Math.pow(indexTip.y - indexMCP.y, 2)
              );
              const middleOpen = Math.sqrt(
                Math.pow(middleTip.x - middleMCP.x, 2) + Math.pow(middleTip.y - middleMCP.y, 2)
              );
              const ringOpen = Math.sqrt(
                Math.pow(ringTip.x - ringMCP.x, 2) + Math.pow(ringTip.y - ringMCP.y, 2)
              );
              const pinkyOpen = Math.sqrt(
                Math.pow(pinky.x - pinkyMCP.x, 2) + Math.pow(pinky.y - pinkyMCP.y, 2)
              );
              const avgFingersOpen = (indexOpen + middleOpen + ringOpen + pinkyOpen) / 4;
              const rawSpan = Math.min(thumbPinkyDist, avgFingersOpen * 1.6);
              rightHandData = { x: rightX, y: rightY, span: rawSpan, landmarks: hand.landmarks };
            }
          } else {
            // 왼손 이펙터 전용 매핑 (손 펼침 정도 측정)
            const leftWrist = hand.landmarks[0];
            const leftMidKnuckle = hand.landmarks[9];
            const leftThumb = hand.landmarks[4];
            const leftPinky = hand.landmarks[20];
            const leftIndexTip = hand.landmarks[8];
            const leftIndexMCP = hand.landmarks[5];
            const leftMiddleTip = hand.landmarks[12];
            const leftMiddleMCP = hand.landmarks[9];
            const leftRingTip = hand.landmarks[16];
            const leftRingMCP = hand.landmarks[13];
            const leftPinkyMCP = hand.landmarks[17];

            if (
              leftWrist &&
              leftMidKnuckle &&
              leftThumb &&
              leftPinky &&
              leftIndexTip &&
              leftIndexMCP &&
              leftMiddleTip &&
              leftMiddleMCP &&
              leftRingTip &&
              leftRingMCP &&
              leftPinkyMCP
            ) {
              hasLeft = true;
              // Z축 (Reverb/Tone): 실제 카메라와의 2D 평면 거리를 산정하기 위해 0번(손목)과 9번(중지 MCP) 사이의 거리를 계산
              const distZ = Math.sqrt(
                Math.pow(leftWrist.x - leftMidKnuckle.x, 2) +
                  Math.pow(leftWrist.y - leftMidKnuckle.y, 2)
              );
              const lThumbPinky = Math.sqrt(
                Math.pow(leftThumb.x - leftPinky.x, 2) + Math.pow(leftThumb.y - leftPinky.y, 2)
              );
              const lIndexOpen = Math.sqrt(
                Math.pow(leftIndexTip.x - leftIndexMCP.x, 2) +
                  Math.pow(leftIndexTip.y - leftIndexMCP.y, 2)
              );
              const lMiddleOpen = Math.sqrt(
                Math.pow(leftMiddleTip.x - leftMiddleMCP.x, 2) +
                  Math.pow(leftMiddleTip.y - leftMiddleMCP.y, 2)
              );
              const lRingOpen = Math.sqrt(
                Math.pow(leftRingTip.x - leftRingMCP.x, 2) +
                  Math.pow(leftRingTip.y - leftRingMCP.y, 2)
              );
              const lPinkyOpen = Math.sqrt(
                Math.pow(leftPinky.x - leftPinkyMCP.x, 2) +
                  Math.pow(leftPinky.y - leftPinkyMCP.y, 2)
              );
              const lAvgOpen = (lIndexOpen + lMiddleOpen + lRingOpen + lPinkyOpen) / 4;
              // Z축 깊이(distZ)와의 상대적 비율을 구함으로써 카메라와의 전후 거리 변동에 철저히 무관한(Scale-Invariant) 펼침 척도 획득
              const rawOpenness = Math.min(lThumbPinky, lAvgOpen * 1.6);
              const ratioOpenness = rawOpenness / Math.max(0.01, distZ);

              // 주먹을 움켜쥘 때(비율 약 0.35)에서 넓게 펼칠 때(비율 약 0.95)까지 0.0 ~ 1.0 매핑
              const leftOpenness = Math.min(
                1.0,
                Math.max(0.0, (ratioOpenness - 0.35) / (0.95 - 0.35))
              );

              leftHandData = { y: leftOpenness, z: distZ };

              // 왼손도 모든 21개 관절의 중심을 무게중심 인식 지점으로 설정
              let leftSumX = 0;
              let leftSumY = 0;
              let leftCount = 0;
              hand.landmarks.forEach((pt) => {
                if (pt) {
                  leftSumX += 1 - pt.x;
                  leftSumY += pt.y;
                  leftCount++;
                }
              });
              const leftCentroidX = leftCount > 0 ? leftSumX / leftCount : 0.5;
              const leftCentroidY = leftCount > 0 ? leftSumY / leftCount : 0.5;

              rawLeftHandRef.current = {
                x: leftCentroidX,
                y: leftCentroidY,
                landmarks: hand.landmarks,
              };
            }
          }
        }
      }
    }

    setLeftActive(hasLeft);
    setRightActive(hasRight);

    // 오디오 합성 코어 갱신 연동
    if (isAudioStartedRef.current) {
      const rightHand = rightHandData;
      const leftHand = leftHandData;

      if (rightHand) {
        rawRightHandRef.current = rightHand;
        const time = performance.now();
        // X축 스무딩 처리 (One Euro Filter)
        const filteredX = oneEuroFilterRef.current.filter(rightHand.x, time);
        // 오른손 가용 범위를 MelodyCore 격자 기둥 영역(0.29~0.975)과
        // 수학적으로 100% 동일하게 일치시켜 반응형 크기 변화와 상관없이 손 마커 입자와 밝아지는 칸이 한 일직선상에 완벽히 오도록 보정
        const startBound = 0.29;
        const endBound = 0.975;
        const normX = Math.max(0, Math.min(1, (filteredX - startBound) / (endBound - startBound)));

        updateRightHandRef.current(normX, rightHand.span);
      } else {
        stopAllRef.current();
      }

      if (leftHand) {
        // Y축(오므림 정도)은 연주자의 빠르고 날카로운 필터 변조 효과를 위해 스무딩을 적용하지 않고 즉각 반영
        const currentY = leftHand.y;

        updateLeftHandRef.current(currentY, leftHand.z);

        // Z축(카메라 거리) LERP 스무딩 연출 (이펙터 게이지 비주얼 바용) - 1.5배 상향 조정 (가중치 0.18)
        smoothedLeftZRef.current =
          smoothedLeftZRef.current + (leftHand.z - smoothedLeftZRef.current) * 0.18;
        const currentZ = smoothedLeftZRef.current;

        // 이펙터 게이지 비주얼 바 피드백 (오디오 엔진 공식과 100% 완벽 동기화)
        const uiReverb = Math.round(Math.min(1.0, Math.max(0.0, (0.22 - currentZ) / 0.11)) * 100);

        setLeftVal({
          reverb: uiReverb,
          filter: Math.round(currentY * 100),
        });
      }
    }
  }, []);

  return {
    leftActive,
    rightActive,
    leftVal,
    borderWarning,
    setBorderWarning,
    handleHandResults,
    rawRightHandRef,
    rawLeftHandRef,
  };
}
