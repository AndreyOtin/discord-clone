'use client';

import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import CreateServer from '@/components/modals/create-server';
import InvitePeople from '@/components/modals/invite-people';
import EditServer from '@/components/modals/edit-server';
import ManageMembers from '@/components/modals/manage-members';
import { ServerWithLinksAndUser } from '@/types/prisma';
import CreateChannel from '@/components/modals/create-channel';
import LeaveServer from '@/components/modals/leave-server';

const MODALS = [
  'creatServer',
  'invite',
  'createChannel',
  'editMembers',
  'editServer',
  'deleteServer',
  'leaveServer'
] as const;

interface Data {
  server?: ServerWithLinksAndUser;
}

interface ModalContext {
  modal: (typeof MODALS)[number] | null;
  openModal: (modal: Modals, data?: Data) => void;
  closeModal: () => void;
  data: Data;
}

type Modals = ModalContext['modal'];

const Context = createContext<ModalContext | null>(null);

function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<Modals>(null);
  const [data, setData] = useState<Data>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const values = useMemo(() => {
    return {
      data,
      modal,
      openModal(modal: Modals, data?: Data) {
        setModal(modal);
        setData(data || {});
      },
      closeModal() {
        setModal(null);
      }
    };
  }, [modal, data]);

  if (!mounted) {
    return null;
  }

  return (
    <Context.Provider value={values}>
      {children}
      <CreateServer />
      <InvitePeople />
      <EditServer />
      <ManageMembers />
      <CreateChannel />
      <LeaveServer />
    </Context.Provider>
  );
}

export const useModalContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('theme context error');
  }

  return context;
};

export default ModalProvider;
