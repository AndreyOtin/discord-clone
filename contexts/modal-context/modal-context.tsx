'use client';

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import CreateServer from '@/components/modals/create-server';
import InvitePeople from '@/components/modals/invite-people';
import EditServer from '@/components/modals/edit-server';
import ManageMembers from '@/components/modals/manage-members';
import { ServerWithLinksAndUser } from '@/types/prisma';
import CreateChannel from '@/components/modals/create-channel';
import LeaveServer from '@/components/modals/leave-server';
import { Channel, ChannelType } from '@prisma/client';

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
  deletedId?: string;
  server?: ServerWithLinksAndUser;
  type?: ChannelType;
  channel?: {
    method: 'PATCH' | 'DELETE' | 'POST';
    channel?: Channel;
  };
}

interface ModalContext {
  modal: (typeof MODALS)[number] | null;
  openModal: (modal: Modals, data?: Data) => void;
  closeModal: () => void;
  data: Data;
  setDeletingId: (id: string) => void;
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

  const openModal = useCallback((modal: Modals, data?: Data) => {
    setModal(modal);
    setData(data || {});
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const setDeletingId = useCallback((id: string) => {
    setData((data) => ({ ...data, deletedId: id }) as Data);
  }, []);

  const values = useMemo(() => {
    return {
      data,
      modal,
      openModal,
      closeModal,
      setDeletingId
    };
  }, [data, modal, openModal, closeModal, setDeletingId]);

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
