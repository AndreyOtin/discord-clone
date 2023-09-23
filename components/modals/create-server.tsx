'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import React from 'react';
import CreateServerForm from '@/components/forms/create-server/create-server-form';
import { useModalContext } from '@/contexts/modal-context/modal-context';

function CreateServer() {
  const { modal, closeModal } = useModalContext();

  return (
    <Dialog open={modal === 'creatServer'} onOpenChange={closeModal}>
      <DialogContent overlayClassName="bg-background/2">
        <DialogHeader>
          <DialogTitle>Создать сервер</DialogTitle>
          <DialogDescription>Введите имя сервера</DialogDescription>
          <DialogDescription>Дополнительно можно загрузить картинку</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <CreateServerForm />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateServer;
