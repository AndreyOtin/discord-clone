import { Channel, Member, Message, Server, User } from '@prisma/client';

export type ServerWithLinks = Server & {
  member: Member[];
  channel: Channel[];
};

export type ServerWithLinksAndUser = Server & {
  member: (Member & { user: User })[];
  channel: Channel[];
};

export type MessageWithUser = Message & {
  member: Member & {
    user: User;
  };
};
