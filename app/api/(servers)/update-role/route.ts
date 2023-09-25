import { checkAuth } from '@/lib/utils';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { Role } from '@prisma/client';

export const PATCH = async (res: Response) => {
  try {
    const { memberId, serverId, role } = (await res.json()) as {
      memberId: string;
      serverId: string;
      role: Role;
    };
    const user = await checkAuth();

    console.log(user);

    if (!user) {
      return NextResponse.json('Ползователь не зарегистрирова', { status: 401 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId
      },
      data: {
        member: {
          update: {
            where: {
              id: memberId,
              role: {
                not: 'ADMIN'
              }
            },
            data: {
              role
            }
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
  } catch {
    return NextResponse.json({ message: 'Произошла ошибка' }, { status: 400 });
  }
};
