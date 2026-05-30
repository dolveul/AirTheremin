import { useEffect, useRef, useState, useCallback } from 'react';
import type { MediaPipeResults, MediaPipeLandmark } from '../types/theremin';

interface HandsInstance {
  setOptions(options: {
    maxNumHands: number;
    modelComplexity: number;
    minDetectionConfidence: number;
    minTrackingConfidence: number;
  }): void;
  onResults(callback: (results: MediaPipeResults) => void): void;
  send(input: { image: HTMLVideoElement }): Promise<void>;
  close(): Promise<void>;
}

interface CameraInstance {
  start(): Promise<void>;
  stop(): void;
}

declare global {
  interface Window {
    Hands: new (config: { locateFile: (file: string) => string }) => HandsInstance;
    Camera: new (
      video: HTMLVideoElement,
      options: { onFrame: () => Promise<void>; width: number; height: number }
    ) => CameraInstance;
  }
}

interface HandposeHookProps {
  onResults: (results: MediaPipeResults) => void;
  onBorderWarning: (warning: boolean) => void;
}

export function useHandpose({ onResults, onBorderWarning }: HandposeHookProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraRef = useRef<CameraInstance | null>(null);
  const handsRef = useRef<HandsInstance | null>(null);

  // 화각 경계선 검사 (상하좌우 10% 영역 이탈 경고)
  const checkBorderWarning = useCallback(
    (landmarksList: MediaPipeLandmark[][]) => {
      let warning = false;
      const border = 0.1;

      for (const landmarks of landmarksList) {
        for (const lm of landmarks) {
          if (lm.x < border || lm.x > 1.0 - border || lm.y < border || lm.y > 1.0 - border) {
            warning = true;
            break;
          }
        }
        if (warning) break;
      }
      onBorderWarning(warning);
    },
    [onBorderWarning]
  );

  const startTracking = useCallback(
    async (videoElement: HTMLVideoElement) => {
      if (!window.Hands || !window.Camera) {
        console.error('MediaPipe가 아직 로드되지 않았습니다.');
        return;
      }

      videoRef.current = videoElement;

      if (!handsRef.current) {
        const hands = new window.Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.55,
          minTrackingConfidence: 0.55,
        });

        hands.onResults((results: MediaPipeResults) => {
          onResults(results);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            checkBorderWarning(results.multiHandLandmarks);
          } else {
            onBorderWarning(false);
          }
        });

        handsRef.current = hands;
      }

      if (!cameraRef.current) {
        const camera = new window.Camera(videoElement, {
          onFrame: async () => {
            if (handsRef.current) {
              await handsRef.current.send({ image: videoElement });
            }
          },
          width: 640,
          height: 480,
        });

        cameraRef.current = camera;
      }

      try {
        await cameraRef.current.start();
        setIsActive(true);
      } catch (err) {
        console.error('카메라 권한 획득 또는 구동 실패:', err);
      }
    },
    [onResults, onBorderWarning, checkBorderWarning]
  );

  const stopTracking = useCallback(() => {
    if (cameraRef.current) {
      try {
        cameraRef.current.stop();
      } catch (err) {
        console.warn('Camera stop error:', err);
      }
      cameraRef.current = null;
    }
    if (handsRef.current) {
      try {
        void handsRef.current.close();
      } catch (err) {
        console.warn('Hands close error:', err);
      }
      handsRef.current = null;
    }
    setIsActive(false);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.Hands && window.Camera) {
        setIsLoaded(true);
        clearInterval(timer);
      }
    }, 300);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    isLoaded,
    isActive,
    startTracking,
    stopTracking,
  };
}
