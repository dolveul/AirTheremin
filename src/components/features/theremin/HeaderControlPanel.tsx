interface HeaderControlPanelProps {
  isAudioStarted: boolean;
  onStart: () => void;
  scale: string;
  onChangeScale: (scale: string) => void;
  isGlideEnabled: boolean;
  onToggleGlide: () => void;
}

export default function HeaderControlPanel({
  isAudioStarted,
  onStart,
  scale,
  onChangeScale,
  isGlideEnabled,
  onToggleGlide,
}: HeaderControlPanelProps) {
  return (
    <header className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl h-16 brushed-metal-plate rounded relative flex items-center justify-between px-6 z-40 shadow-2xl">
      {/* Corner Rivets representing physical installation */}
      <div className="rivet absolute top-2 left-2" />
      <div className="rivet absolute top-2 right-2" />
      <div className="rivet absolute bottom-2 left-2" />
      <div className="rivet absolute bottom-2 right-2" />

      <div className="flex items-center gap-2 pl-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#f2ca50] animate-pulse shadow-[0_0_8px_rgba(242,202,80,0.8)]" />
        <h1 className="font-headline-lg text-lg font-bold tracking-wider text-[#f2ca50] amber-glow-text">
          AcousticSynth V2
        </h1>
      </div>

      <div className="flex items-center gap-3 pr-2">
        {!isAudioStarted ? (
          <button
            onClick={onStart}
            className="px-5 py-2 text-xs font-bold font-label-caps brass-plate text-[#3c2f00] rounded hover:brightness-110 active:translate-y-0.5 transition-all uppercase tracking-wider"
          >
            오디오 기동 (Start)
          </button>
        ) : (
          <>
            <select
              value={scale}
              onChange={(e) => onChangeScale(e.target.value)}
              className="bg-[#231f1b] border border-[#4d4635] rounded px-3 py-2 text-xs text-[#f2ca50] font-sans focus:outline-none focus:border-[#d4af37]"
            >
              <option value="pentatonic">5음계 (펜타토닉 - Pentatonic)</option>
              <option value="diatonic">7음계 (C 메이저 - C Major Key)</option>
              <option value="chromatic">반음계 (크로매틱 - Chromatic)</option>
            </select>

            <button
              onClick={onToggleGlide}
              className={`px-4 py-2 text-xs font-bold font-label-caps border rounded transition-all active:translate-y-0.5 ${
                isGlideEnabled
                  ? 'bg-[#d4af37]/15 text-[#f2ca50] border-[#d4af37]/40 shadow-[0_0_10px_rgba(242,202,80,0.15)]'
                  : 'bg-[#231f1b] hover:bg-[#2e2925] border-[#4d4635] text-[#d0c5af]'
              }`}
            >
              글라이드 (Glide)
            </button>
          </>
        )}
      </div>
    </header>
  );
}
