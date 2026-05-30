export interface MediaPipeLandmark {
  x: number;
  y: number;
  z: number;
}

export interface MediaPipeResults {
  multiHandLandmarks?: MediaPipeLandmark[][];
  multiHandedness?: {
    index: number;
    score: number;
    label: 'Left' | 'Right';
  }[];
}
