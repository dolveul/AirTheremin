# 🎻 AcousticSynth V2 (Air Theremin)

> **A high-fidelity 2.5D Hybrid Virtual Instrument utilizing computer-vision hand tracking and Web Audio DSP.**  
> **웹캠 손동작 트래킹과 웹 오디오 신호 처리 기술로 탄생한 하이엔드 공간 가상 악기 (에어 테레민).**

---

## 🌟 Key Highlights / 핵심 특징

AcousticSynth V2 is a retro-futuristic, high-fidelity virtual instrument inspired by the classic Theremin. By integrating **MediaPipe Hands** and the native **Web Audio API**, it allows users to play lush, expressive music in their browser using nothing but a standard webcam—no special hardware required.

AcousticSynth V2는 고전 테레민(Theremin)에서 영감을 얻은 레트로-퓨처리즘 스타일의 고품질 가상 공간 악기입니다. **MediaPipe Hands**의 정밀 손동작 트래킹과 **웹 오디오 API(Web Audio API)** 기술을 결합하여, 특수 장비 없이 오직 일반 웹캠만으로 허공에서 매우 섬세하고 웅장한 연주가 가능합니다.

---

## 🎨 Professional DSP Architecture / 프로급 음향 엔진 구성

The audio core has been finely engineered for professional, crystal-clear, studio-grade sound without digital clipping or output drops:

소프트웨어 레벨에서 발생하는 주파수 왜곡과 소리 찢어짐을 원천 방어하여 레코딩 스튜디오급의 깨끗하고 풍성한 사운드를 자랑합니다:

- **Dual-Oscillator Voice Blending**: Employs a perfect blend of **80% Sine wave** (for pure fundamental frequency) and **20% Triangle wave** (for warm, brassy overtone warmth).
- **Portamento Glide (Hz-level interpolation)**: Rather than immediate frequency jumps, the synth slides smoothly from note to note at the hertz level, mimicking the true slide behavior of physical string/air instruments.
- **Unity-Gain Convolver Reverb**: Incorporates a mathematically equalized impulse response convolver. A custom `0.018` scaling factor ensures that switching the reverb on and off maintains **perfectly uniform loudness**—only adding spaciousness without volume spikes.
- **Smooth Feedback Delay**: Operates in parallel with the reverb to provide a rich, cascading echo tail that naturally fades.
- **Master Brickwall Limiter**: Connected at the final output stage (`Threshold: -3.5dB`, `Ratio: 20:1`, `Attack: 2ms`) with calibrated **`-1.5dB` headroom**, making it physically impossible for the audio to clip or "tear" even on small smartphone speakers.

---

## 🎮 Interactive Controls / 조작 안내

- **Right Hand (Pitch & Voice Activation)**:
  - **X-axis (Horizontal)**: Controls the melody pitch. Fully aligned with the high-contrast mahogany keys.
  - **Hand Span (Fingers Openness)**: Controls the volume. Closing your hand into a fist instantly silences the voice, while opening it generates a swelling wave.
- **Left Hand (DSP Effectors & Filter)**:
  - **Y-axis (Fingers Spread)**: Controls the Lowpass Filter Cutoff frequency (up to 2000Hz).
  - **Z-axis (Distance to Camera)**: Controls the Reverb and Delay levels. Moving your hand closer to the camera decreases reverb to `0%` (Dry), while pulling back sweeps it up to max spaciousness (Wet).

---

## 🏛️ Premium Retro-Futuristic UI / 프리미엄 디자인 토큰

- **Mahogany & Brass Console**: Rich wood grains, brushed copper plates, and industrial brass rivets.
- **Centered Vertical Scale Grid**: Large, bold note labels (with octave numbers removed) stacked vertically in the center of high-contrast warm white key boundaries (`border-white/25`) for instant visual navigation from a distance.
- **2.5D Holographic Hand visualization**: Renders neon glowing bones, joints, and stardust particle gravity streams that converge toward your hand's mathematical centroid.
- **Liquid Wave Oscilloscope**: Renders a highly responsive liquid glass waveform reflecting live Web Audio buffer data.

---

## 🛠️ Getting Started / 시작하기

### Prerequisites

- Node.js (v20 or higher recommended)
- A webcam connected to your machine

### Setup & Run

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/acousticsynth-v2.git
    cd acousticsynth-v2
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Launch the development server**:

    ```bash
    npm run dev -- --host
    ```

    _Open the HTTPS local URL (e.g., `https://localhost:5173`) in your browser. Web camera access requires HTTPS or localhost._

4.  **Production build & Local CI validation**:
    ```bash
    npm run ci:local
    ```

---

## 📚 Repository Structure / 디렉토리 구조 요약

- `src/components/features/theremin/` — Core instrument views (`MelodyCore.tsx`, `EffectorConsole.tsx`, `HeaderControlPanel.tsx`).
- `src/hooks/useThereminAudio.ts` — Web Audio API nodes, parallel routing, and limiter chain.
- `src/hooks/useThereminHandposeParser.ts` — Normalizes hand coordinates and maps openness metrics.
- `src/hooks/useThereminCanvas.ts` — Double-canvas renderer for volumetric holograms and liquid wave oscilloscope.
- `src/hooks/useHandpose.ts` — Safe MediaPipe script injector with camera handlers.
- `docs/` — Extensive performance, design, and architecture blueprints.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
Designed and coded with 💛 for makers, musicians, and developers alike.
