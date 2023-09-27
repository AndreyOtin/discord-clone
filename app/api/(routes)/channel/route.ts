import { checkAuth } from '@/lib/utils';
import { NextResponse } from 'next/server';
import db from '@/lib/prisma/db';
import { Role } from '@prisma/client';
import { createChannelSchema } from '@/consts/schemas';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { name, type } = createChannelSchema.parse(body);
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
        member: {
          some: {
            userId: user.userId,
            role: {
              in: [Role.ADMIN, Role.MODERATOR]
            }
          }
        }
      },
      data: {
        channel: {
          create: {
            name,
            type,
            userId: user.userId
          }
        }
      },
      include: {
        member: {
          include: {
            user: true
          },
          orderBy: {
            user: {
              name: 'asc'
            }
          }
        },
        channel: true
      }
    });

    return NextResponse.json(server, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: e }, { status: 500 });
  }
};
