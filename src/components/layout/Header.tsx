/**
 * 헤더 컴포넌트
 */

import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            BASE
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="text-1rem text-gray-600 hover:text-gray-800">
              홈
            </Link>
            <Link to="/about" className="text-1rem text-gray-600 hover:text-gray-800">
              소개
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
