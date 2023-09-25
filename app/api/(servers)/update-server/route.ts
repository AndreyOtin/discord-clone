import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/utils';

export const PATCH = async (req: Request) => {
  try {
    const { serverId } = (await req.json()) as { serverId: string };

    const user = await checkAuth();

    if (!user) {
      return NextResponse.json('Ползователь не зарегистрирова', { status: 401 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        userId: user.userId
      },
      data: {
        inviteCode: crypto.randomUUID()
      }
    });
    return NextResponse.json({ server }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Произошла ошибка' }, { status: 400 });
  }
};
