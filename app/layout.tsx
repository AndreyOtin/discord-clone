import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React, { ReactElement } from 'react';
import Providers from '@/components/providers/providers';
import '@uploadthing/react/styles.css';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/app/api/uploadthing/core';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Дискорд клон',
  description: 'Пэт проект'
};

export default function RootLayout({ children }: { children: ReactElement }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
