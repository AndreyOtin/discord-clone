import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '@/types/app';
import db from '@/lib/prisma/db';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/config';
import { IoEvent } from '@/consts/enums';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'POST') {
    res.socket.server.io.emit(IoEvent.ChatError);
    res.end();
  }

  try {
    const session = await getServerSession(req, res, authConfig);
    const { content } = JSON.parse(req.body);
    const { channelId, serverId } = req.query;
    const user = session?.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!serverId) {
      res.socket.server.io.emit(IoEvent.ChatError, { error: 'Server ID missing' });
      res.end();
      return;
    }

    if (!channelId) {
      res.socket.server.io.emit(IoEvent.ChatError, { error: 'ChannelMessages ID missing' });
      res.end();
      return;
    }

    if (!content) {
      res.socket.server.io.emit(IoEvent.ChatError, { error: 'Content missing' });
      res.end();
      return;
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        member: {
          some: {
            userId: user.userId
          }
        }
      },
      include: {
        member: true
      }
    });

    if (!server) {
      res.socket.server.io.emit(IoEvent.ChatError, { message: 'Server not found' });
      res.end();
      return;
    }

    const member = server.member.find((m) => m.userId === user.userId);

    if (!member) {
      res.socket.server.io.emit(IoEvent.ChatError, { message: 'Member not found' });
      res.end();
      return;
    }

    const message = await db.message.create({
      data: {
        content,
        channelId: channelId as string,
        memberId: member.id
      },
      include: {
        member: {
          include: {
            user: true
          }
        }
      }
    });

    const event = IoEvent.ChatMessages + channelId;
    res.socket.server.io.emit(event, message);
    res.end();
  } catch (error) {
    res.socket.server.io.emit(IoEvent.ChatError);
    res.end();
  }
}
