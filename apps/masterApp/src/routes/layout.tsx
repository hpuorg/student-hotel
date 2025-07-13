import { Outlet } from '@modern-js/runtime/router';
import HeroUIProvider from '../components/providers/HeroUIProvider';
import '../styles/globals.css';

export default function Layout() {
  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </HeroUIProvider>
  );
}
