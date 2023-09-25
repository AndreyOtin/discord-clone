'use client';

import React, { ForwardRefExoticComponent, Fragment, useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  LucideProps,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role, Server } from '@prisma/client';
import { useModalContext } from '@/contexts/modal-context/modal-context';
import { ServerWithLinksAndUser } from '@/types/prisma';
import { useSession } from 'next-auth/react';

type Menu = {
  onClick: (data: { server: Server }) => void;
  text: string;
  Icon: ForwardRefExoticComponent<LucideProps>;
  separator?: boolean;
  color?: string;
};

interface UserMenuProps {
  server: ServerWithLinksAndUser;
}

const createMenu = (cb: {
  onClick: ReturnType<typeof useModalContext>['openModal'];
}): Record<Role, Menu[]> => {
  const invite: Menu = {
    onClick: (data) => cb.onClick('invite', data),
    text: 'Пригласить людей',
    Icon: UserPlus,
    color: 'text-blue-400'
  };

  const editMembers: Menu = {
    onClick: (data) => cb.onClick('invite', data),
    text: 'Настройка участников',
    Icon: Users
  };

  const editServer: Menu = {
    onClick: (data) => cb.onClick('editServer', data),
    text: 'Настройка сервера',
    Icon: Settings
  };

  const createChannel: Menu = {
    onClick: (data) => cb.onClick('createChannel', data),
    text: 'Создать канал',
    Icon: PlusCircle
  };

  const deleteServer: Menu = {
    onClick: (data) => cb.onClick('deleteServer', data),
    text: 'Удалить сервер',
    Icon: Trash,
    separator: true,
    color: 'text-destructive'
  };

  return {
    ADMIN: [invite, createChannel, editMembers, editServer, deleteServer],
    GUEST: [deleteServer],
    MODERATOR: [invite, createChannel, editMembers, editServer, deleteServer]
  };
};

function UserMenu({ server }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const { openModal } = useModalContext();
  const session = useSession();
  const user = server.member.find((m) => m.userId === session.data?.user?.userId);

  return (
    <div className={''}>
      <h2 className={'sr-only'}>Меню пользователя</h2>
      <DropdownMenu onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild ref={button}>
          <button
            className={
              'flex min-h-[3rem] w-full items-center justify-between p-2 hover:bg-white/10'
            }
          >
            Меню настроек
            <ChevronDown className={cn(open && 'rotate-[180deg]', 'transition-all')} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={'w-[200px]'}>
          {createMenu({ onClick: openModal })[user?.role || 'GUEST'].map(
            ({ onClick, Icon, text, separator, color }) => (
              <Fragment key={text}>
                {separator && <DropdownMenuSeparator />}
                <DropdownMenuItem>
                  <button
                    onClick={() => onClick({ server })}
                    className={cn('m-0 flex w-full justify-between text-[12px]', color && color)}
                  >
                    {text}
                    <Icon className={'text-[12px]'} />
                  </button>
                </DropdownMenuItem>
              </Fragment>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserMenu;
