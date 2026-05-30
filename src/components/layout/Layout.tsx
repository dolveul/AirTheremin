import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#110e0a]">
      {!isHome && <Header />}
      <main className="flex-grow flex flex-col relative">
        <Outlet />
      </main>
      {!isHome && <Footer />}
    </div>
  );
}
