import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '@/lib/prisma';
import { hashPassword, matchPassword } from '@/lib/encrypt-password';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const AuthConfig: AuthOptions = {
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith', required: true },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const { email, password } = credentials as NonNullable<typeof credentials>;

        const user = await prisma.user.findFirst({
          where: {
            email
          }
        });
        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              email: credentials?.email,
              password: hashPassword(password)
            }
          });

          return { id: newUser.id, email: newUser.email };
        }

        const result = matchPassword(credentials?.password || '', user.name || '');

        if (!result) {
          return null;
        }

        return { id: user.id, email: user.email };
      }
    })
  ],
  pages: {
    signIn: '',
    error: '/',
    newUser: '/',
    signOut: '',
    verifyRequest: '/'
  }
};

const handler = NextAuth(AuthConfig);

export { handler as GET, handler as POST };
