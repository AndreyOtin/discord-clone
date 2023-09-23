import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma/prisma';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AppRoutes, RegisterFormVariant } from '@/consts/enums';
import { hashPassword, matchPassword } from '@/lib/encrypt-password';

export const authConfig: AuthOptions = {
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
        password: { label: 'Password', type: 'password' },
        variant: { type: 'text' }
      },
      async authorize(credentials) {
        const { email, password, variant } = credentials as NonNullable<typeof credentials>;

        if (variant === RegisterFormVariant.Signin) {
          const user = await prisma.user.findFirst({
            where: {
              email
            }
          });

          if (!user) {
            return null;
          }

          const result = matchPassword(password, user.password || '');

          if (!result) {
            return null;
          }

          const { password: p, ...rest } = user;

          return { ...rest };
        }

        try {
          const newUser = await prisma.user.create({
            data: {
              email,
              password: hashPassword(password)
            }
          });

          const { password: p, ...rest } = newUser;

          return { ...rest };
        } catch (e) {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: AppRoutes.Signin,
    error: '/',
    newUser: '/',
    signOut: '/',
    verifyRequest: '/'
  },
  callbacks: {
    async jwt({ user, token }) {
      if (user?.id) {
        token.userId = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.userId = token.userId;
      }

      return session;
    }
  }
};
