import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '@/types/app';
import db from '@/lib/prisma/db';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/config';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
      return res.status(400).json({ error: 'Server ID missing' });
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID missing' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content missing' });
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
      return res.status(404).json({ message: 'Server not found' });
    }

    const message = await db.message.create({
      data: {
        content,
        channelId: channelId as string,
        userId: user.userId
      },
      include: {
        user: true
      }
    });

    const channelKey = `chat:${channelId}:messages`;
    res.socket.server.io.emit(channelKey, message);
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ message: 'Internal Error' });
  }
}
