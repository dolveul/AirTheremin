export default function LandscapeOrientationGuide() {
  return (
    <div className="hidden max-md:portrait:flex fixed inset-0 wood-texture z-[9999] flex-col items-center justify-center p-6 text-center">
      {/* Warm filament glow backing */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,202,80,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Animated Phone Icon container */}
      <div className="relative w-28 h-28 mb-8 flex items-center justify-center glass-module rounded-full border border-primary/20">
        {/* Pulsing filament rings */}
        <div className="absolute inset-0 rounded-full border border-[#f2ca50]/20 animate-ping opacity-60" />
        <div className="absolute inset-2 rounded-full border border-[#f2ca50]/10 animate-pulse" />

        {/* Smartphone rotate svg */}
        <svg
          className="w-16 h-16 text-[#f2ca50] animate-rotate-phone drop-shadow-[0_0_8px_rgba(242,202,80,0.4)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-7.5 15h12"
          />
        </svg>
      </div>

      {/* Dynamic Text guidelines */}
      <h3 className="text-1.5rem font-bold font-headline-lg text-[#f2ca50] amber-glow-text mb-3 tracking-wider">
        가로 모드로 회전해주세요
      </h3>
      <p className="text-0.875rem text-[#d0c5af] max-w-xs leading-relaxed font-sans">
        AcousticSynth는 2.5D 공간 악기 연주를 위해{' '}
        <strong className="text-[#f2ca50]">가로 모드(Landscape)</strong>에 최적화되어 있습니다.
        스마트폰의 자동 회전을 켠 후 눕혀주세요.
      </p>
    </div>
  );
}
