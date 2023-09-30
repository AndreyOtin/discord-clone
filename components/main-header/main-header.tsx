'use client';
import React from 'react';
import { Channel } from '@prisma/client';
import { channelIconMap } from '@/components/icon-maps';
import { Loader2 } from 'lucide-react';
import { useSocket } from '@/contexts/socket-context/socket-context';
import { cn } from '@/lib/utils';

type MainHeaderProps = {
  channel: Channel;
};

function MainHeader({ channel }: MainHeaderProps) {
  const { isConnected } = useSocket();
  return (
    <header className={'flex min-h-[40px] border-b border-neutral-400 dark:border-muted p-4'}>
      <div className={'flex gap-x-2'}>
        <p className={'flex'}>
          <span>{channelIconMap[channel.type]}</span>
          {channel.name}
        </p>
        <p
          className={cn(
            'text-amber-500 flex items-center gap-x-2',
            isConnected && 'text-green-500'
          )}
        >
          {!isConnected && <Loader2 className={'animate-spin'} />}
          Соединение с сервером
        </p>
      </div>
    </header>
  );
}

export default MainHeader;
