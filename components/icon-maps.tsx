import { ChannelType, Role } from '@prisma/client';
import React, { ReactElement } from 'react';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

export const roleIconMap: Record<Role, ReactElement | null> = {
  [Role.GUEST]: null,
  [Role.MODERATOR]: React.createElement(ShieldCheck, {
    className: 'aspect-square w-4 text-teal-400'
  }),
  [Role.ADMIN]: React.createElement(ShieldAlert, {
    className: 'aspect-square w-4 text-red-900'
  })
};

export const channelIconMap: Record<ChannelType, ReactElement> = {
  [ChannelType.TEXT]: React.createElement(Hash, {
    className: 'aspect-square w-4'
  }),
  [ChannelType.AUDIO]: React.createElement(Mic, {
    className: 'aspect-square w-4'
  }),
  [ChannelType.VIDEO]: React.createElement(Video, {
    className: 'aspect-square w-4'
  })
};
