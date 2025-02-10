import { Outlet } from 'react-router-dom';
import { Toaster } from '@/shared/ui/shadcn/toaster';
import { Header } from '@/widgets';
import { FloatingButton } from '@/shared/ui';
import { Providers } from '../providers';

export function Layout() {
  return (
    <Providers>
      <Header />
      <main className="pt-[74px] h-full">
        <Outlet />
      </main>
      <Toaster />
      <FloatingButton />
    </Providers>
  );
}
