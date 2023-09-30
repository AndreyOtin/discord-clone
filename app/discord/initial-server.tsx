'use client';

import { useEffect } from 'react';
import { useModalContext } from '@/contexts/modal-context/modal-context';

function InitialServer() {
  const { openModal } = useModalContext();
  useEffect(() => {
    openModal('creatServer');
  }, [openModal]);

  return null;
}

export default InitialServer;
