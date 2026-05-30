interface EffectorConsoleProps {
  leftActive: boolean;
  leftVal: { reverb: number; filter: number };
}

export default function EffectorConsole({ leftActive, leftVal }: EffectorConsoleProps) {
  return (
    <article className="w-1/4 h-full brushed-metal-plate relative flex flex-col items-center justify-between p-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
      {/* Corner Rivets representing physical installation */}
      <div className="rivet absolute top-2 left-2" />
      <div className="rivet absolute top-2 right-2" />
      <div className="rivet absolute bottom-2 left-2" />
      <div className="rivet absolute bottom-2 right-2" />

      <div className="text-center w-full mt-1">
        <h2 className="font-label-caps text-[8px] md:text-[10px] text-[#99907c] uppercase tracking-widest mb-1">
          EFFECTOR CONSOLE
        </h2>
        <div
          className={`font-label-caps text-[8px] md:text-[10px] font-bold py-0.5 px-2 rounded inline-block transition-all ${
            leftActive
              ? 'bg-[#d4af37]/15 text-[#f2ca50] border border-[#d4af37]/30 shadow-[0_0_8px_rgba(242,202,80,0.15)]'
              : 'bg-[#231f1b] text-[#99907c] border border-transparent'
          }`}
        >
          {leftActive ? 'L-HAND: ACTIVE' : 'L-HAND: WAITING'}
        </div>
      </div>

      {/* Responsive flex track container */}
      <div className="flex justify-around w-full flex-grow items-center py-2 h-0 min-h-0">
        {/* 리버브 앰비언트 세로 리세스 슬라이더 */}
        <div className="flex flex-col items-center gap-1.5 h-full justify-between">
          <span className="font-label-caps text-[9px] text-[#99907c] uppercase tracking-wider text-center">
            Reverb
          </span>
          <div className="relative w-8 flex-grow max-h-[140px] md:max-h-[220px] bg-[#110e0a] rounded-full border border-[#4d4635] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] flex flex-col items-center py-2">
            <div
              className="absolute inset-x-0 bottom-2 rounded-full bg-gradient-to-t from-[#723200] to-[#f89c64] opacity-35 transition-all duration-100"
              style={{ height: `${leftVal.reverb * 0.85}%` }}
            />
            {/* Recessed tick marks */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 15px, #4d4635 16px)',
              }}
            />
            {/* Gliding Machined Brass Handle */}
            <div
              className="z-10 w-12 h-5 brushed-brass border border-[#532200] rounded shadow-[0_2px_4px_rgba(0,0,0,0.7)] absolute transition-all duration-100 flex items-center justify-center"
              style={{
                bottom: `calc(${leftVal.reverb}% * 0.78 + 4px)`,
              }}
            >
              <div className="w-6 h-0.5 bg-[#532200]/40" />
            </div>
          </div>
          <span className="font-data-mono text-[10px] text-[#f2ca50] amber-glow-text">
            {leftVal.reverb}%
          </span>
        </div>

        {/* 필터 컷오프 세로 리세스 슬라이더 */}
        <div className="flex flex-col items-center gap-1.5 h-full justify-between">
          <span className="font-label-caps text-[9px] text-[#99907c] uppercase tracking-wider text-center">
            Filter
          </span>
          <div className="relative w-8 flex-grow max-h-[140px] md:max-h-[220px] bg-[#110e0a] rounded-full border border-[#4d4635] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] flex flex-col items-center py-2">
            <div
              className="absolute inset-x-0 bottom-2 rounded-full bg-gradient-to-t from-[#2d3404] to-[#c3cc8c] opacity-35 transition-all duration-100"
              style={{ height: `${leftVal.filter * 0.85}%` }}
            />
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 15px, #4d4635 16px)',
              }}
            />
            <div
              className="z-10 w-12 h-5 brushed-brass border border-[#532200] rounded shadow-[0_2px_4px_rgba(0,0,0,0.7)] absolute transition-all duration-100 flex items-center justify-center"
              style={{
                bottom: `calc(${leftVal.filter}% * 0.78 + 4px)`,
              }}
            >
              <div className="w-6 h-0.5 bg-[#532200]/40" />
            </div>
          </div>
          <span className="font-data-mono text-[10px] text-[#c3cc8c]">{leftVal.filter}%</span>
        </div>
      </div>
    </article>
  );
}
