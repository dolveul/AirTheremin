import { getScaleFrequencies } from '../../../utils/thereminHelpers';

interface MelodyCoreProps {
  rightActive: boolean;
  noteInfo: { noteName: string; freq: number; volume: number };
  isLoaded: boolean;
  isAudioStarted: boolean;
  scale: string;
}

export default function MelodyCore({
  rightActive,
  noteInfo,
  isLoaded,
  isAudioStarted,
  scale,
}: MelodyCoreProps) {
  // 선택한 음계의 정확한 음높이 주파수 및 이름 목록 계산
  const freqs = getScaleFrequencies(scale);

  return (
    <article className="w-3/4 h-full flex flex-col justify-between p-4 md:p-6">
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="font-label-caps text-[10px] text-[#99907c] uppercase tracking-widest mb-2">
            MELODY CORE
          </h2>
          <div
            className={`font-label-caps text-[10px] font-bold py-1 px-3 rounded inline-block transition-all ${
              rightActive
                ? 'bg-[#d4af37]/15 text-[#f2ca50] border border-[#d4af37]/30 shadow-[0_0_10px_rgba(242,202,80,0.15)]'
                : 'bg-[#231f1b] text-[#99907c] border border-transparent'
            }`}
          >
            {rightActive ? 'R-HAND: ACTIVE' : 'R-HAND: WAITING'}
          </div>
        </div>

        {/* 실시간 진공관 계기판 HUD (Vacuum Tube HUD Display) */}
        <div className="bg-[#110e0a] border border-[#4d4635] px-3 md:px-5 py-1.5 md:py-2.5 rounded flex items-center gap-4 md:gap-6 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] relative">
          <div className="absolute top-1 left-2 w-1.5 h-1.5 rounded-full bg-[#f2ca50]/15" />
          <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#f2ca50]/15" />

          <div>
            <span className="font-label-caps text-[8px] text-[#99907c] uppercase tracking-wider block">
              PLAYING NOTE
            </span>
            <span className="font-headline-lg text-sm md:text-lg font-bold text-[#f2ca50] amber-glow-text leading-none block">
              {noteInfo.noteName || '-'}
            </span>
          </div>
          <div className="w-[1px] h-6 md:h-8 bg-[#4d4635]" />
          <div>
            <span className="font-label-caps text-[8px] text-[#99907c] uppercase tracking-wider block">
              FREQUENCY
            </span>
            <span className="font-data-mono text-[11px] md:text-sm text-[#d0c5af] leading-none block">
              {noteInfo.freq > 0 ? `${noteInfo.freq.toFixed(1)} Hz` : '0.0 Hz'}
            </span>
          </div>
        </div>
      </div>

      {/* 중앙 리세스 음계 건반 격자 (Recessed Mahogany Pitch Grid) */}
      <div className="relative flex-grow my-2 md:my-4 bg-[#110e0a] border border-[#4d4635] rounded shadow-[inset_0_2px_15px_rgba(0,0,0,0.9)] overflow-hidden flex items-center justify-center">
        {/* Mahogany background grain showing inside grid */}
        <div className="absolute inset-0 mahogany-texture opacity-30 pointer-events-none" />

        {noteInfo.freq === 0 && (
          <div className="absolute inset-0 bg-[#17130f]/75 backdrop-blur-[1px] flex items-center justify-center z-10">
            <p className="font-headline-lg text-xs md:text-sm text-[#d0c5af] text-center px-4 md:px-6 leading-relaxed max-w-md">
              {!isLoaded
                ? 'MediaPipe 엔진 동기화 중...'
                : !isAudioStarted
                  ? '오른쪽 위의 오디오 시작 버튼을 눌러 하드웨어 장치를 활성화하세요.'
                  : '공중에 오른손을 올리고 손가락을 펼치면 신비로운 아날로그 사운드가 시작됩니다.'}
            </p>
          </div>
        )}

        {/* Dynamic brass vertical pitch columns with live active feedback highlight */}
        <div className="absolute inset-0 flex pointer-events-none select-none z-0">
          {freqs.map((freq, i) => {
            const isActive = rightActive && noteInfo.noteName === freq.name;
            const noteLetter = freq.name.replace(/\d+/g, ''); // 옥타브 숫자(예: C4 -> C) 완전 제거

            return (
              <div
                key={i}
                className={`flex-1 border-r border-white/25 relative h-full flex flex-col justify-center items-center transition-all duration-150 last:border-r-0 ${
                  isActive
                    ? 'bg-[#d4af37]/15 border-r-[#f2ca50] shadow-[inset_0_0_15px_rgba(242,202,80,0.15)]'
                    : ''
                }`}
              >
                {/* 큼지막하게 세로로 누적 표기되는 옥타브 배제 프리미엄 폰트 */}
                <div
                  className={`flex flex-col items-center justify-center font-headline-lg transition-all duration-150 ${
                    isActive
                      ? 'text-[#f2ca50] scale-110 font-bold drop-shadow-[0_0_8px_rgba(242,202,80,0.8)]'
                      : 'text-[#d0c5af]/50'
                  }`}
                >
                  {noteLetter.split('').map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className="text-sm md:text-2xl font-bold leading-none tracking-normal"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Engraved watermark label at the top to avoid text overlap */}
        <div className="absolute top-2 md:top-4 font-bold font-label-caps text-[9px] md:text-[10px] text-[#4d4635] select-none tracking-[0.4em] uppercase z-10 pointer-events-none">
          {scale} scale matrix
        </div>
      </div>

      {/* 하단 볼륨 수은관 게이지 (Mercury Tube Volume progress bar) */}
      <footer className="w-full flex items-center gap-3 bg-[#1f1b17] border border-[#4d4635] p-2 md:p-3 rounded">
        <span className="font-label-caps text-[8px] md:text-[9px] text-[#99907c] font-bold whitespace-nowrap uppercase tracking-wider">
          Volume Tube
        </span>
        <div className="relative flex-grow h-3 bg-[#110e0a] rounded-full border border-[#4d4635] shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)] overflow-hidden">
          <div
            className="h-full mercury-tube-fill transition-all duration-75"
            style={{ width: `${noteInfo.volume}%` }}
          />
        </div>
        <span className="font-data-mono text-[10px] md:text-xs text-[#f2ca50] amber-glow-text font-bold w-10 text-right">
          {noteInfo.volume}%
        </span>
      </footer>
    </article>
  );
}
