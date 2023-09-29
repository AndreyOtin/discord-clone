'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { cn, throttle } from '@/lib/utils';
import ActionTooltip from '@/components/action-tooltip/action-tooltip';
import { LogOut, Moon, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useModalContext } from '@/contexts/modal-context/modal-context';
import { useThemeContext } from '@/contexts/theme-context/theme-context';
import { TooltipContentProps } from '@/components/ui/tooltip';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppRoutes } from '@/consts/enums';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ServerWithLinks } from '@/types/prisma';

interface SideBarProps {
  className?: string;
  servers: ServerWithLinks[];
}

const tooltipConfig: TooltipContentProps = {
  side: 'right',
  align: 'center'
};

const buttonClassName =
  'mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-600 text-white ' +
  'transition-all  hover:rounded-[20px] hover:text-emerald-500 dark:bg-muted';

function ActionsSidebar({ className, servers }: SideBarProps) {
  const { openModal } = useModalContext();
  const { setTheme } = useThemeContext();
  const params = useParams();
  const bottom = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const [scrollAreaHeight, setScrollAreaHeight] = useState(0);

  const calculateHeight = () => {
    if (!top.current || !bottom.current) {
      return;
    }

    return (
      window.innerHeight -
      top.current.offsetTop -
      top.current.offsetHeight -
      bottom.current.offsetHeight -
      50
    );
  };

  useLayoutEffect(() => {
    setScrollAreaHeight(calculateHeight() || 0);

    const observer = new ResizeObserver(
      throttle(() => {
        setScrollAreaHeight(calculateHeight() || 0);
      }, 300)
    );

    observer.observe(window.document.documentElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={cn(className, 'relative px-2 py-4')}>
      <h2 className={'sr-only'}>Меню действий</h2>
      <nav className={'flex h-full flex-col'}>
        <div ref={top} className={'mb-2'}>
          <ActionTooltip text={'Создать сервер'} config={tooltipConfig}>
            <button onClick={() => openModal('creatServer')} className={buttonClassName}>
              <Plus />
            </button>
          </ActionTooltip>
        </div>
        <Separator className={'mb-2 h-[1px] bg-neutral-400 dark:bg-muted'} />
        <ScrollArea style={{ height: `${scrollAreaHeight}px` }}>
          <ul className={'mb-2 space-y-2'}>
            {servers.map(({ imageUrl, id, name }) => (
              <li key={id} className={'relative'}>
                {params.id === id && (
                  <Separator
                    className={'absolute left-0 top-0 w-[1px] rounded bg-primary'}
                    orientation={'vertical'}
                  />
                )}
                <ActionTooltip text={`${name}`} config={tooltipConfig}>
                  <Link
                    href={`${AppRoutes.App}/${id}`}
                    className={cn(buttonClassName, 'relative overflow-hidden')}
                  >
                    {imageUrl ? (
                      <Image fill src={imageUrl} alt={`Автарка сервера ${name}`} />
                    ) : (
                      <span>CN</span>
                    )}
                  </Link>
                </ActionTooltip>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <Separator className={'mb-2 mt-auto h-[1px] bg-neutral-400 dark:bg-muted'} />
        <div ref={bottom} className={'grid space-y-2'}>
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
      </nav>
      <Separator
        className={'absolute bottom-4 right-0 top-4 h-auto bg-neutral-400 dark:bg-muted'}
        orientation="vertical"
      />
    </div>
  );
}

export default ActionsSidebar;
