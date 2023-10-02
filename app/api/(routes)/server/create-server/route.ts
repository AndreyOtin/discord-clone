import { CreateServerFormBody } from '@/components/forms/create-server/create-server-form';
import { checkAuth } from '@/lib/utils';
import db from '@/lib/prisma/db';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const { serverName, serverImage } = (await req.json()) as CreateServerFormBody;
    const user = await checkAuth();

    if (!user) {
      return NextResponse.json('Ползователь не зарегистрирова', { status: 401 });
    }

    const server = await db.server.create({
      data: {
        imageUrl: serverImage,
        name: serverName,
        userId: user.userId,
        inviteCode: crypto.randomUUID(),
        member: {
          create: {
            userId: user.userId,
            role: 'ADMIN'
          }
        },
        channel: {
          create: {
            userId: user.userId,
            name: 'general'
          }
        }
      },
      include: {
        member: true,
        channel: true
      }
    });

    return NextResponse.json(server);
  } catch (e) {
    let message = '';

    if (e instanceof Error) {
      message = e.message;
    } else {
      message = 'Произошла ошибка';
    }

    return NextResponse.json(message, { status: 400 });
  }
};

export const PATCH = async (req: Request) => {
  try {
    const { serverName, serverImage, serverId } = (await req.json()) as CreateServerFormBody & {
      serverId: string;
    };

    const user = await checkAuth();

    if (!user) {
      return NextResponse.json('Ползователь не зарегистрирова', { status: 401 });
    }

    const server = await db.server.update({
      where: { id: serverId },
      data: {
        imageUrl: serverImage,
        name: serverName
      },
      include: {
        member: true,
        channel: true
      }
    });

    return NextResponse.json(server);
  } catch (e) {
    let message = '';

    if (e instanceof Error) {
      message = e.message;
    } else {
      message = 'Произошла ошибка';
    }

    return NextResponse.json(message, { status: 400 });
  }
};
