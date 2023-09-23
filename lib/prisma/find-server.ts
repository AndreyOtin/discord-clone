import prisma from '@/lib/prisma/prisma';

export const findServer = async (userId: string) => {
  return prisma.server.findFirst({
    where: {
      member: {
        some: {
          userId
        }
      }
    }
  });
};
