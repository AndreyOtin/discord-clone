import { checkAuth } from '@/lib/utils';
import { NextResponse } from 'next/server';
import db from '@/lib/prisma/db';
import { Role } from '@prisma/client';

export const DELETE = async (req: Request) => {
  try {
    const { memberId, serverId } = (await req.json()) as {
      memberId: string;
      serverId: string;
    };

    const user = await checkAuth();

    if (!user) {
      return NextResponse.json('Ползователь не зарегистрирова', { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId
      },
      data: {
        member: {
          delete: {
            id: memberId,
            userId: {
              not: user.userId
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
    return NextResponse.json({ message: 'Произошла ошибка' }, { status: 500 });
  }
};

export const PATCH = async (req: Request) => {
  try {
    const { memberId, serverId, role } = (await req.json()) as {
      memberId: string;
      serverId: string;
      role: Role;
    };
    const user = await checkAuth();

    if (!user) {
      return NextResponse.json('Ползователь не зарегистрирова', { status: 401 });
    }

    const server = await db.server.update({
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
    return NextResponse.json({ message: 'Произошла ошибка' }, { status: 500 });
  }
};
