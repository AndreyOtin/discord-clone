import { checkAuth } from '@/lib/utils';
import { NextResponse } from 'next/server';
import db from '@/lib/prisma/db';

export const PATCH = async (req: Request) => {
  try {
    const user = await checkAuth();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return NextResponse.json('Нет айди сервера', { status: 400 });
    }
    if (!user) {
      return NextResponse.json('Ползователь не зарегистрирова', { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: {
          not: user.userId
        }
      },
      data: {
        member: {
          deleteMany: {
            userId: user.userId
          }
        }
      },
      select: {
        member: true
      }
    });

    return NextResponse.json(server, { status: 200 });
  } catch (e) {
    return NextResponse.json('error', { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const user = await checkAuth();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return NextResponse.json('Нет айди сервера', { status: 400 });
    }
    if (!user) {
      return NextResponse.json('Ползователь не зарегистрирова', { status: 401 });
    }

    await db.server.delete({
      where: {
        id: serverId,
        userId: user.userId

      }
    });

    return NextResponse.json({ status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json('error', { status: 500 });
  }
};
