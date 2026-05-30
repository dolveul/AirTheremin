// C2 (36) to C6 (84) MIDI 주파수 풀 계산용 오프셋
export const SCALE_OFFSETS = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  pentatonic: [0, 2, 4, 7, 9], // C Major Pentatonic (도 레 미 솔 라)
  diatonic: [0, 2, 4, 5, 7, 9, 11], // C Major Key (다장조 - 도 레 미 파 솔 라 시)
};

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getScaleFrequencies(activeScale: string): { hz: number; name: string }[] {
  const freqs: { hz: number; name: string }[] = [];
  const offsets =
    SCALE_OFFSETS[activeScale as keyof typeof SCALE_OFFSETS] || SCALE_OFFSETS.pentatonic;

  // 모든 음계의 기음 시작점을 C3(48)로 통일하고,
  // 5음계는 2옥타브(C5=72), 7음계/반음계는 3옥타브(C6=84)로 각각 옥타브 범위를 1옥타브씩 줄여 쾌적한 플레이 공간 확보
  const startM = 48;
  const endM = activeScale === 'pentatonic' ? 72 : 84;

  for (let m = startM; m <= endM; m++) {
    const pitchClass = m % 12;
    if (offsets.includes(pitchClass)) {
      const hz = 440 * Math.pow(2, (m - 69) / 12);
      const octave = Math.floor(m / 12) - 1;
      const name = `${NOTE_NAMES[pitchClass]}${octave}`;

      freqs.push({ hz, name });
    }
  }
  return freqs;
}

export function createImpulseResponse(ctx: AudioContext, duration = 2.0, decay = 2.5): AudioBuffer {
  const rate = ctx.sampleRate;
  const len = rate * duration;
  const buffer = ctx.createBuffer(2, len, rate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // 컨볼루션 연산 시 주파수 성분 결합으로 일어나는 극단적인 음향 에너지 증폭 현상을 제어하여
  // 원본 소리 크기와 리버브 잔향 음량 간의 완벽한 Unity Gain 평탄화를 구현하는 에너지 감쇠 계수
  const scalingFactor = 0.018;

  for (let i = 0; i < len; i++) {
    const dec = Math.exp((-i / len) * decay);
    left[i] = (Math.random() * 2 - 1) * dec * scalingFactor;
    right[i] = (Math.random() * 2 - 1) * dec * scalingFactor;
  }
  return buffer;
}
