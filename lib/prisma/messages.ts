import db from '@/lib/prisma/db';

export const getMessages = async (channelId: string) => {
  return db.message.findMany({
    where: {
      channelId
    },
    include: {
      member: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
};
