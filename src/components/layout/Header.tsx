import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isHomeActive = location.pathname === '/';
  const isAboutActive = location.pathname === '/about';

  return (
    <header className="bg-[#110e0a] border-b border-[#4d4635] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)] z-50 relative">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="font-headline-lg text-xl font-bold tracking-widest text-[#f2ca50] hover:brightness-110 transition-all drop-shadow-[0_0_8px_rgba(242,202,80,0.4)]"
          >
            AcousticSynth
          </Link>
          <div className="flex gap-6 font-label-caps text-xs">
            <Link
              to="/"
              className={`transition-colors tracking-widest ${
                isHomeActive
                  ? 'text-[#f2ca50] amber-glow-text'
                  : 'text-[#d0c5af] hover:text-[#f2ca50]'
              }`}
            >
              연주 (PERFORM)
            </Link>
            <div className="w-[1px] h-4 bg-[#4d4635]" />
            <Link
              to="/about"
              className={`transition-colors tracking-widest ${
                isAboutActive
                  ? 'text-[#f2ca50] amber-glow-text'
                  : 'text-[#d0c5af] hover:text-[#f2ca50]'
              }`}
            >
              정보 (ABOUT)
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
