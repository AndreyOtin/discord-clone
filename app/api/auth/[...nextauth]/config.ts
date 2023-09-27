import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import db from '@/lib/prisma/db';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AppRoutes, RegisterFormVariant } from '@/consts/enums';
import { hashPassword, matchPassword } from '@/lib/encrypt-password';

export const authConfig: AuthOptions = {
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'name', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        variant: { type: 'text' }
      },
      async authorize(credentials) {
        const { email, password, variant, name } = credentials as NonNullable<typeof credentials>;

        if (variant === RegisterFormVariant.Signin) {
          const user = await db.user.findFirst({
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

          user.password = null;

          return user;
        }

        try {
          const newUser = await db.user.create({
            data: {
              email,
              password: hashPassword(password),
              name
            }
          });

          newUser.password = null;

          return newUser;
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
