import db from '@/lib/prisma/db';

export const getChannel = async (channelId: string) => {
  return db.channel.findUnique({
    where: {
      id: channelId
    },
    include: {
      user: true
    }
  });
};
