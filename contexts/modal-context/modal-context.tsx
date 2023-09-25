'use client';

import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import CreateServer from '@/components/modals/create-server';
import InvitePeople from '@/components/modals/invite-people';
import { Server } from '@prisma/client';

const MODALS = [
  'creatServer',
  'invite',
  'createChannel',
  'editMembers',
  'editServer',
  'deleteServer'
] as const;

interface Data {
  server?: Server;
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
