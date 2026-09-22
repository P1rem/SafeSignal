import { Outlet } from 'react-router-dom';
import { AuthorityNav } from '@/components/AuthorityNav';

export function AuthorityLayout() {
  return (
    <div className="min-h-screen bg-navy-50 flex flex-col">
      <AuthorityNav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
