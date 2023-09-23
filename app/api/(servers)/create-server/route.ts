import { CreateServerFormBody } from '@/components/forms/create-server/create-server-form';
import { checkAuth } from '@/lib/utils';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const { serverName, serverImage } = (await req.json()) as CreateServerFormBody;
  const user = await checkAuth();

  if (!user) {
    return NextResponse.json('Ползователь не зарегистрирова', { status: 401 });
  }

  try {
    const server = await prisma.server.create({
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
      }
    });
    return NextResponse.json({ serverId: server.id });
  } catch (e) {
    let message = '';

    if (e instanceof Error) {
      message = e.message;
    } else {
      message = 'Произошла ошибка';
    }

    return NextResponse.json({ message }, { status: 400 });
  }
};
