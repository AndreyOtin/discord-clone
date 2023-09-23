import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AppRoutes } from '@/consts/enums';
import { authConfig } from '@/app/api/auth/[...nextauth]/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function checkAuth({ forApp = false }: { forApp?: boolean } = {}) {
  const session = await getServerSession(authConfig);

  if (session?.user && forApp) {
    return redirect(AppRoutes.App);
  }

  if (!session?.user && !forApp) {
    return redirect('/');
  }

  return session?.user;
}
