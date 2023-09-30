import React from 'react';
import { Channel } from '@prisma/client';
import { channelIconMap } from '@/components/icon-maps';

type MainHeaderProps = {
  channel: Channel;
};

function MainHeader({ channel }: MainHeaderProps) {
  return (
    <header className={'flex min-h-[40px] border-b p-4'}>
      <div className={'flex gap-x-2'}>
        <span>{channelIconMap[channel.type]}</span>
        <p>{channel.name}</p>
      </div>
    </header>
  );
}

export default MainHeader;
