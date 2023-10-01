import React from 'react';
import { MessageWithUser } from '@/types/prisma';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import dayjs from 'dayjs';
import { roleIconMap } from '@/components/icon-maps';

type ChannelMessageProps = {
  message: MessageWithUser;
};

function ChannelMessage({ message }: ChannelMessageProps) {
  return (
    <li className={'p-2 grid'}>
      <div className={'flex items-center gap-x-2 mb-2'}>
        <Avatar>
          <AvatarImage src={message.member.user.image || undefined} />
          <AvatarFallback>N</AvatarFallback>
        </Avatar>
        <div>
          <p className={'flex items-center gap-x-2'}>
            <span>{message.member.user.name}</span>
            {roleIconMap[message.member.role]}
          </p>
          <time>{dayjs(message.createdAt).format('DD.MM.YYYY, HH:mm:ss')}</time>
        </div>
      </div>
      <p className="p-4 pl-12 pr-12 bg-muted dark:bg-neutral-900 rounded-l">{message.content}</p>
    </li>
  );
}

export default ChannelMessage;
