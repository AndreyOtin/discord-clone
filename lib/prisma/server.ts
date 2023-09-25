import prisma from '@/lib/prisma/prisma';
import { ServerWithLinks, ServerWithLinksAndUser } from '@/types/prisma';

export const findUserServers = async (userId: string): Promise<ServerWithLinks[]> => {
  return prisma.server.findMany({
    where: {
      member: {
        some: {
          userId
        }
      }
    },
    include: {
      member: true,
      channel: true
    }
  });
};

export const findAnyUserServer = async (userId: string) => {
  return prisma.server.findFirst({
    where: {
      member: {
        some: {
          userId
        }
      }
    },
    include: {
      member: {
        where: {
          userId
        }
      },
      channel: true
    }
  });
};

export const findServer = async (serverId: string): Promise<ServerWithLinksAndUser | null> => {
  return prisma.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      member: {
        include: {
          user: true
        }
      },
      channel: true
    }
  });
};
