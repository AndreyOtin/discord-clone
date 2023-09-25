import React from 'react';
import UserMenu from '@/components/user-menu/user-menu';
import { ServerWithLinksAndUser } from '@/types/prisma';

interface ServerMenuSidebarProps {
  server: ServerWithLinksAndUser;
}

async function ServerMenuSidebar({ server }: ServerMenuSidebarProps) {
  return (
    <div className={'px-2 py-4'}>
      <UserMenu server={server} />
    </div>
  );
}

export default ServerMenuSidebar;
