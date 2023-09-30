import React from 'react';
import { findServer } from '@/lib/prisma/server';
import { notFound } from 'next/navigation';
import ServerMenuSidebar from '@/components/server-menu-sidebar/server-menu-sidebar-props';
import { checkAuth } from '@/lib/utils';
import { getMessages } from '@/lib/prisma/messages';
import Channel from '@/components/channel/channel';

async function ChannelPage({
  params,
  searchParams
}: {
  params: { id: string; channelId: string };
  searchParams: { cursor: string };
}) {
  await checkAuth();
  const server = await findServer(params.id);
  const { newCursor, messages } = await getMessages(params.channelId, searchParams.cursor);

  if (!server) {
    return notFound();
  }

  return (
    <>
      <ServerMenuSidebar server={server} />
      <main className={'text-red-700 p-4'}>
        <Channel
          serverId={params.id}
          cursor={newCursor}
          messages={messages}
          channelId={params.channelId}
        />
      </main>
    </>
  );
}

export default ChannelPage;
