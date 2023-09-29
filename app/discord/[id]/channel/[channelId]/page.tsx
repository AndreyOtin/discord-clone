import React from 'react';
import { findServer } from '@/lib/prisma/server';
import { notFound } from 'next/navigation';
import ServerMenuSidebar from '@/components/server-menu-sidebar/server-menu-sidebar-props';

async function Channel({ params }: { params: { id: string; channelId: string } }) {
  const server = await findServer(params.id);

  if (!server) {
    return notFound();
  }

  return (
    <>
      <ServerMenuSidebar server={server} />
      <main className={'text-red-700 p-4'}>{params.channelId}</main>
    </>
  );
}

export default Channel;
