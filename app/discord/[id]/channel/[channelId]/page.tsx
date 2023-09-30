import React from 'react';
import { findServer } from '@/lib/prisma/server';
import { notFound } from 'next/navigation';
import ServerMenuSidebar from '@/components/server-menu-sidebar/server-menu-sidebar-props';
import { checkAuth } from '@/lib/utils';
import { getMessages } from '@/lib/prisma/messages';
import Channel from '@/components/channel/channel';
import MainHeader from '@/components/main-header/main-header';
import { getChannel } from '@/lib/prisma/channel';
import MessageForm from '@/components/forms/message/message-form';

async function ChannelPage({ params }: { params: { id: string; channelId: string } }) {
  await checkAuth();
  const server = await findServer(params.id);
  const channel = await getChannel(params.channelId);
  const messages = await getMessages(params.channelId);

  if (!server || !channel) {
    return notFound();
  }

  return (
    <>
      <ServerMenuSidebar server={server} />
      <main className={'p-4 flex flex-col h-full'}>
        <MainHeader channel={channel} />
        <Channel
          className={''}
          serverId={params.id}
          messages={messages}
          channelId={params.channelId}
        />
        <MessageForm channelId={params.channelId} serverId={params.id} className={'mb-12'} />
      </main>
    </>
  );
}

export default ChannelPage;
