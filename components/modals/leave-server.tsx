'use client';

import React, { startTransition, useState } from 'react';
import { useModalContext } from '@/contexts/modal-context/modal-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ApiRoutes, AppRoutes } from '@/consts/enums';
import { use404 } from '@/hooks/utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function LeaveServer() {
  const { modal, closeModal, data } = useModalContext();
  const to404 = use404();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLeaveClick = async () => {
    setIsLoading(true);
    const url = new URL(window.location.origin + ApiRoutes.LeaveServer);
    url.searchParams.set('serverId', data.server?.id || '');

    console.log(url);

    const response = await fetch(url, {
      method: modal === 'deleteServer' ? 'DELETE' : 'PATCH'
    });

    if (!response.ok) {
      to404();
    } else {
      startTransition(() => {
        closeModal();
        setIsLoading(false);
        router.refresh();
        router.push(AppRoutes.App);
      });
    }
  };

  return (
    <Dialog open={modal === 'leaveServer' || modal === 'deleteServer'} onOpenChange={closeModal}>
      <DialogContent overlayClassName="bg-background/2">
        <DialogHeader className={'space-y-4 mb-4'}>
          <DialogTitle>{modal === 'deleteServer' ? 'Удалить' : 'Покинуть сервер'}</DialogTitle>
        </DialogHeader>
        <div className={'flex justify-around'}>
          <Button onClick={closeModal}>Отмена</Button>
          <Button onClick={handleLeaveClick}>
            {isLoading && <Loader2 className={'animate-spin'} />}
            Подтвердить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveServer;
