import React from 'react';

import { checkAuth } from '@/lib/utils';
import { findServer } from '@/lib/prisma/find-server';
import { AppRoutes } from '@/consts/enums';
import { redirect } from 'next/navigation';

async function Page() {
  const user = await checkAuth();
  const server = await findServer(user?.userId || '');

  if (server) {
    const path = `${AppRoutes.App}/${server.id}`;
    return redirect(path);
  }

  return (
    <main>
      <div className="flex  items-center justify-center"></div>
    </main>
  );
}

export default Page;
