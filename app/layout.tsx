import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React, { ReactElement } from 'react';
import Providers from '@/components/providers/providers';
import '@uploadthing/react/styles.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Дискорд клон',
  description: 'Пэт проект'
};

export default function RootLayout({ children }: { children: ReactElement }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children} </Providers>
      </body>
    </html>
  );
}
