import 'next-auth';
import 'next-auth/jwt';
import 'socket.io';

declare module 'next-auth' {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userId: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
  }
}

declare module 'socket.io' {
  interface ServerOptions {
    addTrailingSlash: boolean;
  }
}
