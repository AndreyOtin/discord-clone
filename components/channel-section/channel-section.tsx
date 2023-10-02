'use client';

import React from 'react';
import { Edit, Lock, Plus, Trash } from 'lucide-react';
import { Channel, ChannelType } from '@prisma/client';

import ActionTooltip from '@/components/action-tooltip/action-tooltip';
import { useModalContext } from '@/contexts/modal-context/modal-context';
import { ServerWithLinksAndUser } from '@/types/prisma';
import { channelIconMap } from '@/components/icon-maps';
import Link from 'next/link';
import { AppRoutes } from '@/consts/enums';
import { cn } from '@/lib/utils';

type ChannelProps = {
  title: string;
  channels: Channel[];
  className?: string;
  type: ChannelType;
  server: ServerWithLinksAndUser;
};

function ChannelSection({ title, channels, className, type, server }: ChannelProps) {
  const { openModal, data } = useModalContext();

  return (
    <div className={className}>
      <div className={'flex justify-between mb-2'}>
        <h2>{title}</h2>
        <ActionTooltip text={'Создать канал'} config={{ side: 'top' }}>
          <button onClick={() => openModal('createChannel', { type, server })}>
            <span className="sr-only">Создать канал</span>
            <Plus className={'hover:text-emerald-500'} />
          </button>
        </ActionTooltip>
      </div>
      <ul>
        {channels.map((c) => {
          const deleted = data.deletedId === c.id;

          return (
            <Link
              key={c.id}
              href={`${AppRoutes.App}/${server.id}/channel/${c.id}`}
              className={cn(deleted && 'opacity-50', 'group relative')}
            >
              <li
                className={
                  'flex gap-x-2 px-3 py-1 items-center group-hover:bg-foreground/10 rounded'
                }
              >
                <span className={''}>{channelIconMap[c.type]}</span>

                {c.name.length > 13 ? (
                  <ActionTooltip text={c.name} config={{ side: 'right' }}>
                    <span className={'line-clamp-1 break-words break-word'}>{c.name}</span>
                  </ActionTooltip>
                ) : (
                  <span className={'line-clamp-1'}>{c.name}</span>
                )}

                {c.name !== 'general' && (
                  <div
                    className={
                      'ml-auto space-x-1 flex-shrink-0 flex items-center pl-0.5 relative z-10'
                    }
                  >
                    <button
                      className={cn(deleted && 'text-amber-500/90')}
                      disabled={deleted}
                      onClick={(e) => {
                        e.preventDefault();
                        openModal('createChannel', {
                          server,
                          type,
                          channel: { channel: c, method: 'PATCH' }
                        });
                      }}
                    >
                      <span className={'sr-only'}>Изменить канала</span>
                      <Edit className={'aspect-square w-4 hover:text-blue-500'} />
                    </button>
                    <button
                      disabled={deleted}
                      className={cn(deleted && 'text-amber-500/90')}
                      onClick={(e) => {
                        e.preventDefault();
                        openModal('createChannel', {
                          server,
                          type,
                          channel: { channel: c, method: 'DELETE' }
                        });
                      }}
                    >
                      <span className={'sr-only'}>Удалить канала</span>
                      <Trash className={'aspect-square w-4 hover:text-blue-500'} />
                    </button>
                  </div>
                )}
                {c.name === 'general' && <Lock className={'aspect-square w-4 ml-auto'} />}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default ChannelSection;
