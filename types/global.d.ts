import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userId: string;
    };
    expires: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
    userId: string;
  }
}