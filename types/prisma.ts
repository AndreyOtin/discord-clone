import { Channel, Member, Server, User } from '@prisma/client';

export type ServerWithLinks = Server & {
  member: Member[];
  channel: Channel[];
};

export type ServerWithLinksAndUser = Server & {
  member: (Member & { user: User })[];
  channel: Channel[];
};
