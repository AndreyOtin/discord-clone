import React from 'react';
import { MessageWithUser } from '@/types/prisma';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ChannelMessageProps = {
  message: MessageWithUser;
};

function ChannelMessage({ message }: ChannelMessageProps) {
  return (
    <li className={'p-2'}>
      <Avatar>
        <AvatarImage src={message.user.image || undefined} />
        <AvatarFallback>N</AvatarFallback>
      </Avatar>
      <span className="">{message.content}</span>
    </li>
  );
}

export default ChannelMessage;
