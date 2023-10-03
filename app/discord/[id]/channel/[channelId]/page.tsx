import React, { Suspense } from 'react';
import { findServer } from '@/lib/prisma/server';
import { notFound } from 'next/navigation';
import { checkAuth } from '@/lib/utils';
import { getMessages } from '@/lib/prisma/messages';
import { getChannel } from '@/lib/prisma/channel';
import { Loader2 } from 'lucide-react';
import MainHeader from '@/components/main-header/main-header';
import ChannelMessages from '@/components/channel/channel-messages';
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
    <Suspense
      fallback={
        <div className={'flex flex-col items-center justify-center flex-1 gap-y-2'}>
          <Loader2 className={'animate-spin'} />
          <p className={'text-lg'}>Loading...</p>
        </div>
      }
    >
      <main className={'p-4 flex flex-col h-full w-full'}>
        <MainHeader channel={channel} />
        <ChannelMessages
          className={''}
          serverId={params.id}
          messages={messages}
          channel={channel}
        />
        <MessageForm channel={channel} serverId={params.id} className={'mb-12'} />
      </main>
    </Suspense>
  );
}

export default ChannelPage;
