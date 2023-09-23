'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import ThemeProvider from '@/contexts/theme-context/theme-context';
import ModalProvider from '@/contexts/modal-context/modal-context';

function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ModalProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ModalProvider>
    </SessionProvider>
  );
}

export default Providers;
