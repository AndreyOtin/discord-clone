'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import React from 'react';
import CreateServerForm from '@/components/forms/create-server/create-server-form';
import { useModalContext } from '@/contexts/modal-context/modal-context';

function EditServer() {
  const { modal, closeModal, data } = useModalContext();

  return (
    <Dialog open={modal === 'editServer'} onOpenChange={closeModal}>
      <DialogContent overlayClassName="bg-background/2">
        <DialogHeader>
          <DialogTitle>Изменить сервер</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <CreateServerForm server={data.server} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditServer;
