import db from '@/lib/prisma/db';
import { ServerWithLinksAndUser } from '@/types/prisma';

export const findUserServers = async (userId: string) => {
  return db.server.findMany({
    where: {
      member: {
        some: {
          userId
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
    },
    orderBy: {
      name: 'asc'
    }
  });
};

export const findAnyUserServer = async (userId: string) => {
  return db.server.findFirst({
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
    },
    orderBy: {
      name: 'asc'
    }
  });
};

export const findServer = async (serverId: string): Promise<ServerWithLinksAndUser | null> => {
  return db.server.findUnique({
    where: {
      id: serverId
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
};
