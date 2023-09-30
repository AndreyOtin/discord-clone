'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSocket } from '@/contexts/socket-context/socket-context';
import ChannelMessage from '@/components/channel-message/channel-message';
import { MessageWithUser } from '@/types/prisma';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ChannelProps = {
  messages: MessageWithUser[];
  channelId: string;
  serverId: string;
  className: string;
};

function Channel({ messages, className, channelId, serverId }: ChannelProps) {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const channelKey = `chat:${channelId}:messages`;
  const [channelMessages, setChannelMessages] = useState(messages);
  const ref = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    ref.current?.scroll({ top: channelMessages.length * 2000, behavior: 'instant' });
  });

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(channelKey, (message: MessageWithUser) => {
      startTransition(() => {
        setChannelMessages((s) => [...s, message]);
      });
    });

    return () => {
      socket.off(channelKey);
    };
  }, [channelKey, router, socket]);

  return (
    <div className={cn(className, 'flex flex-col flex-1')}>
      {!isConnected && <Loader2 className={'animate-spin'} />}

      <ul
        ref={ref}
        className={'p-2 flex flex-col mt-auto max-h-[770px] overflow-y-auto scroll-custom'}
      >
        {channelMessages.map((m) => (
          <ChannelMessage key={m.id} message={m} />
        ))}
      </ul>
    </div>
  );
}

export default Channel;
