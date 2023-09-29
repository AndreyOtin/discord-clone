import React, { ReactNode } from 'react';
import { findServer } from '@/lib/prisma/server';
import { notFound } from 'next/navigation';
import ServerMenuSidebar from '@/components/server-menu-sidebar/server-menu-sidebar-props';

async function Server({ params }: { params: { id: string }; children: ReactNode }) {
  const server = await findServer(params.id);

  if (!server) {
    return notFound();
  }

  return <ServerMenuSidebar server={server} />;
}

export default Server;
