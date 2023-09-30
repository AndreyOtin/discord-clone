'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import ThemeProvider from '@/contexts/theme-context/theme-context';
import ModalProvider from '@/contexts/modal-context/modal-context';
import { SocketProvider } from '@/contexts/socket-context/socket-context';

function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ModalProvider>
        <SocketProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SocketProvider>
      </ModalProvider>
    </SessionProvider>
  );
}

export default Providers;
