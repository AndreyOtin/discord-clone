import db from '@/lib/prisma/db';
import { Message } from '@prisma/client';

const TAKE = 10;

export const getMessages = async (channelId: string, cursor = '') => {
  let messages: Message[];

  if (cursor) {
    messages = await db.message.findMany({
      take: TAKE,
      skip: 1,
      cursor: {
        id: cursor
      },
      where: {
        channelId
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  } else {
    messages = await db.message.findMany({
      where: {
        channelId
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  let newCursor = cursor;

  if (messages.length >= TAKE) {
    newCursor = messages[messages.length - 1].id;
  }

  return { messages, newCursor };
};
