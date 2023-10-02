'use client';

import React, { startTransition, useState } from 'react';
import { useModalContext } from '@/contexts/modal-context/modal-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ApiRoute, AppRoutes } from '@/consts/enums';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

function LeaveServer() {
  const { modal, closeModal, data } = useModalContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLeaveClick = async () => {
    setIsLoading(true);
    const url = new URL(window.location.origin + ApiRoute.LeaveServer);
    url.searchParams.set('serverId', data.server?.id || '');

    const response = await fetch(url, {
      method: modal === 'deleteServer' ? 'DELETE' : 'PATCH'
    });

    if (!response.ok) {
      toast({
        title: 'Что то пошло не так',
        variant: 'destructive'
      });

      setIsLoading(false);
    } else {
      closeModal();
      router.refresh();
      router.push(AppRoutes.App);
    }
    startTransition(() => {
      setIsLoading(false);
    });
  };

  return (
    <Dialog open={modal === 'leaveServer' || modal === 'deleteServer'} onOpenChange={closeModal}>
      <DialogContent overlayClassName="bg-background/2">
        <DialogHeader className={'space-y-4 mb-4'}>
          <DialogTitle>{modal === 'deleteServer' ? 'Удалить' : 'Покинуть сервер'}</DialogTitle>
        </DialogHeader>
        <div className={'flex justify-around'}>
          <Button disabled={isLoading} onClick={closeModal}>
            Отмена
          </Button>
          <Button disabled={isLoading} onClick={handleLeaveClick}>
            {isLoading && <Loader2 className={'animate-spin'} />}
            Подтвердить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveServer;
