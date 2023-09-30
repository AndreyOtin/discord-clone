'use client';

import { useRouter } from 'next/navigation';
import React, { startTransition, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSocket } from '@/contexts/socket-context/socket-context';
import ChannelMessage from '@/components/channel-message/channel-message';
import { MessageWithUser } from '@/types/prisma';
import { cn } from '@/lib/utils';
import { Channel } from '@prisma/client';
import { channelIconMap } from '@/components/icon-maps';
import { IoEvent } from '@/consts/enums';
import { Button } from '@/components/ui/button';
import { AlertOctagon } from 'lucide-react';

type ChannelProps = {
  messages: MessageWithUser[];
  channel: Channel;
  serverId: string;
  className: string;
};

function ChannelMessages({ messages, className, channel }: ChannelProps) {
  const router = useRouter();
  const { socket } = useSocket();
  const [channelMessages, setChannelMessages] = useState(messages);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    ref.current?.scroll({ top: ref.current.scrollHeight, behavior: 'smooth' });
  });

  useEffect(() => {
    if (!socket) {
      return;
    }

    const ioEvent = IoEvent.ChatMessages + channel.id;

    socket.on(ioEvent, (message: MessageWithUser) => {
      startTransition(() => {
        setChannelMessages((s) => [...s, message]);
      });
    });

    socket.on(IoEvent.ChatError, () => {
      startTransition(() => {
        setError(true);
      });
    });

    return () => {
      socket.off(ioEvent);
      socket.off(IoEvent.ChatError);
    };
  }, [channel.id, router, socket]);

  if (error) {
    return (
      <div className={'flex-1 flex flex-col items-center justify-center gap-y-2'}>
        <AlertOctagon size={32} color="#aa5555" />
        <p>Что то пошло не так</p>
        <Button
          size={'sm'}
          onClick={() => {
            setError(false);
            router.push(window.location.href);
          }}
        >
          Перезагрузить
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(className, 'mt-auto flex flex-col flex-1 overflow-y-auto scroll-custom p-4')}
    >
      <div className={'flex-1'} />
      <span
        className={
          'flex-shrink-0 w-20 aspect-square justify-center items-center flex rounded-full bg-muted dark:bg-zinc-800 mb-4'
        }
      >
        {React.cloneElement(channelIconMap[channel.type], {
          className: 'w-3/4 aspect-square h-auto'
        })}
      </span>
      <h2>Добро пожаловать!</h2>
      <ul className={'p-2 mt-auto flex flex-col'}>
        {channelMessages.map((m) => (
          <ChannelMessage key={m.id} message={m} />
        ))}
      </ul>
    </div>
  );
}

export default ChannelMessages;
