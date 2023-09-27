import { checkAuth } from '@/lib/utils';
import { redirect } from 'next/navigation';
import db from '@/lib/prisma/db';
import { AppRoutes } from '@/consts/enums';

async function Invite({ params }: { params: { id: string } }) {
  const user = await checkAuth();

  if (!user) {
    return redirect('/');
  }

  const server = await db.server.findFirst({
    where: {
      inviteCode: params.id,
      member: {
        some: {
          userId: user.userId
        }
      }
    }
  });

  if (server) {
    return redirect(`${AppRoutes.App}/${server.id}`);
  }

  const result = await db.server.update({
    where: {
      inviteCode: params.id
    },
    data: {
      member: {
        create: {
          userId: user.userId
        }
      }
    }
  });

  return redirect(`${AppRoutes.App}/${result.id}`);
}

export default Invite;
