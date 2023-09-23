import React, { ReactNode } from 'react';
import Sidebar from '@/components/sidebar/sidebar';
import UserMenu from '@/components/user-menu/user-menu';

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[80px_200px_1fr]">
      <Sidebar className={'px-20'} />
      <UserMenu />
      {children}
    </div>
  );
}

export default Layout;
