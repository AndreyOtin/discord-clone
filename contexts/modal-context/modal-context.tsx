'use client';

import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import CreateServer from '@/components/modals/create-server';

const MODALS = ['creatServer'] as const;

interface ModalContext {
  modal: (typeof MODALS)[number] | null;
  openModal: (modal: Modals) => void;
  closeModal: () => void;
}

type Modals = ModalContext['modal'];

const Context = createContext<ModalContext | null>(null);

function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<Modals | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const values = useMemo(() => {
    return {
      modal,
      openModal(modal: Modals) {
        setModal(modal);
      },
      closeModal() {
        setModal(null);
      }
    };
  }, [modal]);

  if (!mounted) {
    return null;
  }

  return (
    <Context.Provider value={values}>
      {children}
      <CreateServer />
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
