import React from 'react';
import { findServer } from '@/lib/prisma/server';
import ServerMenuSidebar from '@/components/server-menu-sidebar/server-menu-sidebar-props';
import { notFound } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
  params: { id: string };
};

const Layout = async ({ children, params }: LayoutProps) => {
  const server = await findServer(params.id);
  if (!server) {
    return notFound();
  }

  return (
    <>
      <ServerMenuSidebar server={server} />
      {children}
    </>
  );
};
export default Layout;
