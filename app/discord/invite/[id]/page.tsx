import { checkAuth } from '@/lib/utils';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma/prisma';
import { AppRoutes } from '@/consts/enums';

async function Invite({ params }: { params: { id: string } }) {
  const user = await checkAuth();

  if (!user) {
    return redirect('/');
  }

  const server = await prisma.server.findFirst({
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

  const result = await prisma.server.update({
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
