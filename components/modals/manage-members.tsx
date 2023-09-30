import React, { startTransition, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useModalContext } from '@/contexts/modal-context/modal-context';
import { Role } from '@prisma/client';
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldCheck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ApiRoute } from '@/consts/enums';
import { roleIconMap } from '@/components/icon-maps';

function ManageMembers() {
  const [loadingId, setLoadingId] = useState('');
  const { modal, closeModal, data, openModal } = useModalContext();
  const members = data.server?.member || [];

  const handleMenuClick = async (memberId: string, role?: Role) => {
    setLoadingId(memberId);
    const response = await fetch(ApiRoute.Members, {
      method: role ? 'PATCH' : 'DELETE',
      body: JSON.stringify({
        serverId: data.server?.id,
        memberId,
        role
      })
    });

    if (response.ok) {
      const res = await response.json();

      startTransition(() => {
        openModal('editMembers', { server: res });
      });
    }

    setLoadingId('');
  };

  return (
    <Dialog open={modal === 'editMembers'} onOpenChange={closeModal}>
      <DialogContent overlayClassName="bg-background/2">
        <DialogHeader className={'space-y-4'}>
          <DialogTitle>Настройка участников</DialogTitle>
          <DialogDescription>Количество {members.length}</DialogDescription>
        </DialogHeader>
        <div className={'max-h-[250px]'}>
          <ScrollArea className={'h-full'}>
            <ul className={'space-y-2'}>
              {members.map((m) => (
                <li key={m.id} className={'flex items-center gap-x-2'}>
                  <Avatar>
                    <AvatarImage src={m.user.image || undefined} />
                    <AvatarFallback>N</AvatarFallback>
                  </Avatar>
                  <div className={'flex flex-col flex-grow break-word'}>
                    <p className={'flex gap-x-1'}>
                      {m.user.name}
                      {roleIconMap[m.role]}
                    </p>
                    <p className={'mt-auto'}>{m.user.email}</p>
                  </div>
                  {m.userId !== data.server?.userId && loadingId !== m.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={'icon'} variant={'ghost'} className={'ml-auto mr-2'}>
                          <span className={'sr-only'}>Действия</span>
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent side={'left'}>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Роль</DropdownMenuSubTrigger>

                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem className={'justify-items-start'}>
                                  <button
                                    onClick={() => handleMenuClick(m.id, 'GUEST')}
                                    className={'w-full flex items-center gap-x-1'}
                                  >
                                    <Shield className={'w-4 aspect-square'} />
                                    Гость
                                    {m.role === 'GUEST' && (
                                      <Check
                                        className={'ml-auto pl-2 box-content w-4 aspect-square'}
                                      />
                                    )}
                                  </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem className={'justify-items-start'}>
                                  <button
                                    onClick={() => handleMenuClick(m.id, 'MODERATOR')}
                                    className={'w-full flex items-center gap-x-1'}
                                  >
                                    <ShieldCheck className={'w-4 aspect-square'} />
                                    Модератор
                                    {m.role === 'MODERATOR' && (
                                      <Check
                                        className={'ml-auto pl-2 box-content w-4 aspect-square'}
                                      />
                                    )}
                                  </button>
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <button
                              onClick={() => handleMenuClick(m.id)}
                              className={'w-full flex items-center gap-x-1'}
                            >
                              <Gavel className={'w-4 aspect-square'} /> Удалить
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenu>
                  )}
                  {m.id === loadingId && <Loader2 className={'animate-spin'} />}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageMembers;
