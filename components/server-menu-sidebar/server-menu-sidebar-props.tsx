import React from 'react';
import UserMenu from '@/components/user-menu/user-menu';
import { ServerWithLinksAndUser } from '@/types/prisma';
import { Separator } from '@/components/ui/separator';
import ChannelSection from '@/components/channel-section/channel-section';
import { Channel, ChannelType } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { AppRoutes } from '@/consts/enums';

interface ServerMenuSidebarProps {
  server: ServerWithLinksAndUser;
}

async function ServerMenuSidebar({ server }: ServerMenuSidebarProps) {
  const channel: Record<ChannelType, Channel[]> = {
    [ChannelType.AUDIO]: [],
    [ChannelType.TEXT]: [],
    [ChannelType.VIDEO]: []
  };

  server.channel.forEach((c) => {
    channel[c.type].push(c);
  });

  return (
    <div className={'px-2 py-4 w-[240px]  flex-shrink-0'}>
      <UserMenu server={server} />
      <Separator className={'mt-2 bg-neutral-400 dark:bg-muted'} />
      <ChannelSection
        server={server}
        type={'TEXT'}
        channels={channel.TEXT}
        title={'Текстовые каналы'}
        className={'mt-4'}
      />
      <ChannelSection
        server={server}
        type={'AUDIO'}
        channels={channel.AUDIO}
        title={'Аудио каналы'}
        className={'mt-4'}
      />
      <ChannelSection
        server={server}
        type={'VIDEO'}
        channels={channel.VIDEO}
        title={'Видео каналы'}
        className={'mt-4'}
      />
      <div className={'mt-4'}>
        <h2 className={'mb-2'}>Участники</h2>
        <ul className={'space-y-4'}>
          {server.member.map((m) => (
            <Link
              key={m.id}
              href={`${AppRoutes.App}/${server.id}/member/${m.id}`}
              className={'group'}
            >
              <li
                className={
                  'flex items-center gap-x-2 group-hover:bg-foreground/10 rounded rounded-l-2xl mb-2'
                }
              >
                <Avatar>
                  <AvatarImage src={m.user.image || ''} />
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
                {m.user.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ServerMenuSidebar;
