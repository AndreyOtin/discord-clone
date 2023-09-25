import React from 'react';
import ServerMenuSidebar from '@/components/server-menu-sidebar/server-menu-sidebar-props';
import { findServer } from '@/lib/prisma/server';
import NotFound from 'next/dist/client/components/not-found-error';

async function Server({ params }: { params: { id: string } }) {
  const server = await findServer(params.id);

  if (!server) {
    return NotFound();
  }

  return (
    <>
      <ServerMenuSidebar server={server} />
      <main className={'text-red-700'}>hello</main>
    </>
  );
}

export default Server;
