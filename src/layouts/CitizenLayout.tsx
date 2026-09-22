import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/CitizenNav';

const fullHeightRoutes = ['/map', '/report/location', '/report/success', '/sos'];

export function CitizenLayout() {
  const location = useLocation();
  const isFullHeight = fullHeightRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col">
      <main className={isFullHeight ? 'flex-1' : 'flex-1 pb-24'}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
