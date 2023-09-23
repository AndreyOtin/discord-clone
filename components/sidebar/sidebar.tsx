'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import VisuallyHidden from '@/components/visually-hidden/visually-hidden';
import ActionTooltip from '@/components/action-tooltip/action-tooltip';
import { LogOut, Moon, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useModalContext } from '@/contexts/modal-context/modal-context';
import { useThemeContext } from '@/contexts/theme-context/theme-context';
import { TooltipContentProps } from '@/components/ui/tooltip';
import { signOut } from 'next-auth/react';

interface SideBarProps {
  className?: string;
}

const tooltipConfig = {
  side: 'right',
  align: 'center'
} satisfies TooltipContentProps;

const buttonClassName =
  'mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-600 text-white transition-all  hover:rounded-[20px] hover:text-emerald-500 dark:bg-muted';

function Sidebar({ className }: SideBarProps) {
  const { openModal } = useModalContext();
  const { setTheme } = useThemeContext();

  return (
    <div className={cn(className, 'relative flex flex-col px-2 py-4')}>
      <Separator
        className={'absolute bottom-4 right-0 top-4 h-auto bg-neutral-400 dark:bg-muted'}
        orientation="vertical"
      />
      <div className={'mb-2'}>
        <VisuallyHidden>
          <h2>Меню действий</h2>
        </VisuallyHidden>
        <ActionTooltip text={'Создать сервер'} config={tooltipConfig}>
          <button
            onClick={() => openModal('creatServer')}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-600 text-white transition-all  hover:rounded-[20px] hover:text-emerald-500 dark:bg-muted"
          >
            <Plus />
          </button>
        </ActionTooltip>
      </div>
      <Separator className={'mb-2 h-[1px] bg-neutral-400 dark:bg-muted'} />
      <div className={'mt-auto grid space-y-2'}>
        <Separator className={'h-[1px] bg-neutral-400 dark:bg-muted'} />
        <ActionTooltip text={'Поменять тему'} config={tooltipConfig}>
          <button
            onClick={() => setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))}
            className={buttonClassName}
          >
            <Moon />
          </button>
        </ActionTooltip>
        <ActionTooltip text={'Выйти'} config={tooltipConfig}>
          <button onClick={() => signOut({ callbackUrl: '/' })} className={buttonClassName}>
            <LogOut />
          </button>
        </ActionTooltip>
      </div>
    </div>
  );
}

export default Sidebar;
