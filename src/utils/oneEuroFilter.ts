/**
 * One Euro Filter
 * 속도 감응형 동적 저주파 통과 필터 (Jitter 감쇄 및 Lag 최소화)
 * Casiez, Roussel, Vogel (2012) 알고리즘 기반 구현
 */

class LowPassFilter {
  private alpha: number;
  private y: number | null = null;

  constructor(alpha: number) {
    this.alpha = alpha;
  }

  public filter(value: number, alpha?: number): number {
    if (alpha !== undefined) {
      this.alpha = alpha;
    }
    if (this.y === null) {
      this.y = value;
      return value;
    }
    const result = this.alpha * value + (1 - this.alpha) * this.y;
    this.y = result;
    return result;
  }

  public lastValue(): number | null {
    return this.y;
  }
}

export class OneEuroFilter {
  private minCutoff: number;
  private beta: number;
  private dcutoff: number;

  private xFilter: LowPassFilter;
  private dxFilter: LowPassFilter;
  private lastTime: number | null = null;

  /**
   * @param minCutoff 필터의 최소 차단 주파수 (낮을수록 정지 상태 지터가 잡힘, 기본 1.0)
   * @param beta 속도에 따른 감도 계수 (높을수록 이동 시 지연 반응이 최소화됨, 기본 0.007)
   * @param dcutoff 속도 변화용 기본 차단 주파수 (기본 1.0)
   */
  constructor(minCutoff = 1.0, beta = 0.007, dcutoff = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dcutoff = dcutoff;
    this.xFilter = new LowPassFilter(this.alpha(minCutoff, 1.0));
    this.dxFilter = new LowPassFilter(this.alpha(dcutoff, 1.0));
  }

  private alpha(cutoff: number, rate: number): number {
    const tau = 1.0 / (2 * Math.PI * cutoff);
    const te = 1.0 / rate;
    return 1.0 / (1.0 + tau / te);
  }

  /**
   * 실시간 노이즈 필터링 좌표 계산
   * @param value 입력 좌표 (raw value)
   * @param timestamp 밀리초 타임스탬프 (DOMHighResTimeStamp)
   */
  public filter(value: number, timestamp: number): number {
    if (this.lastTime === null) {
      this.lastTime = timestamp;
      return this.xFilter.filter(value);
    }

    const dt = (timestamp - this.lastTime) / 1000.0;
    if (dt <= 0) {
      return this.xFilter.lastValue() ?? value;
    }

    this.lastTime = timestamp;
    const rate = 1.0 / dt;

    // 1. 이전 위치와의 차이를 통해 속도(dx) 계산 및 필터링
    const prevX = this.xFilter.lastValue() ?? value;
    const dx = (value - prevX) * rate;
    const edx = this.dxFilter.filter(dx, this.alpha(this.dcutoff, rate));

    // 2. 필터 속도 강도에 감응하여 차단 주파수(cutoff) 동적 계산
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    return this.xFilter.filter(value, this.alpha(cutoff, rate));
  }
}
