import React, { ReactNode } from 'react';
import ActionsSidebar from '@/components/actions-sidebar/actions-sidebar';
import { checkAuth } from '@/lib/utils';
import { findUserServers } from '@/lib/prisma/server';

async function Layout({ children }: { children: ReactNode }) {
  const session = await checkAuth();
  const servers = await findUserServers(session?.userId || '');

  return (
    <div className="flex h-full">
      <ActionsSidebar servers={servers} />
      {children}
    </div>
  );
}

export default Layout;
