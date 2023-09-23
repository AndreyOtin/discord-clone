import NextAuth from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/config';

const GET = NextAuth(authConfig);
const POST = NextAuth(authConfig);

export { GET, POST };
