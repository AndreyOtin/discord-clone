import db from '@/lib/prisma/db';
import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/utils';

export const PATCH = async (req: Request) => {
  try {
    const { serverId } = (await req.json()) as { serverId: string };

    const user = await checkAuth();

    if (!user) {
      return NextResponse.json('Ползователь не зарегистрирова', { status: 401 });
    }

    const server = await db.server.update({
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
    return NextResponse.json('Произошла ошибка', { status: 500 });
  }
};
