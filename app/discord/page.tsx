import React from 'react';

import { checkAuth } from '@/lib/utils';
import { findAnyUserServer } from '@/lib/prisma/server';
import InitialServer from '@/app/discord/initial-server';
import { AppRoutes } from '@/consts/enums';
import { redirect } from 'next/navigation';

async function Page() {
  const user = await checkAuth();
  const server = await findAnyUserServer(user?.userId || '');

  if (server) {
    const path = `${AppRoutes.App}/${server.id}`;
    return redirect(path);
  }

  return (
    <main>
      <div className="flex  items-center justify-center">
        <InitialServer />
      </div>
    </main>
  );
}

export default Page;
