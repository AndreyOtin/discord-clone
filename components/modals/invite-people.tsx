'use client';

import React, { useState } from 'react';
import { useModalContext } from '@/contexts/modal-context/modal-context';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { ApiRoute } from '@/consts/enums';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

function InvitePeople() {
  const { modal, closeModal, data, openModal } = useModalContext();
  const [copy, setCopy] = useState(false);
  const inviteUrl = `${window.location.origin}/invite/${data.server?.inviteCode}`;
  const id = crypto.randomUUID();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCopyClick = () => {
    setCopy(true);
    navigator.clipboard.writeText(inviteUrl);
  };

  const handelCloseModal = () => {
    closeModal();
    setCopy(false);
  };

  const generateNewCode = async () => {
    setIsLoading(true);
    setCopy(false);
    await navigator.clipboard.writeText('');

    const response = await fetch(ApiRoute.UpdateInviteCode, {
      method: 'PATCH',
      body: JSON.stringify({ serverId: data.server?.id })
    });

    if (response.ok) {
      const responseData = await response.json();
      openModal('invite', { server: responseData.server });
    } else {
      toast({
        title: 'Что то пошло не так',
        variant: 'destructive'
      });
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={modal === 'invite'} onOpenChange={handelCloseModal}>
      <DialogContent overlayClassName="bg-background/2">
        <DialogHeader className={'space-y-4'}>
          <DialogTitle>Пригласить друзей</DialogTitle>
          <Label htmlFor={id}>Введите имя сервера</Label>
          <div className={'flex items-center gap-x-3'}>
            <Input readOnly id={id} value={inviteUrl} />
            <Button size={'icon'} variant={'ghost'} onClick={handleCopyClick}>
              {copy ? <Check /> : <Copy />}
            </Button>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            size={'sm'}
            variant={'link'}
            className={'mr-auto flex gap-x-2'}
            onClick={generateNewCode}
            disabled={isLoading}
          >
            Создать cсылку
            <RefreshCw className={cn(isLoading && 'animate-spin')} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InvitePeople;
