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

export const throttle = (cb: (...args: []) => void, delay: number) => {
  let lastExecuted = false;

  return function (...args: []) {
    if (lastExecuted) {
      return;
    }

    lastExecuted = true;
    setTimeout(() => {
      lastExecuted = false;
      cb(...args);
    }, delay);
  };
};

export const isIncluded = <T extends readonly string[]>(str: string, values: T): str is T[number] =>
  values.includes(str);

export const callAll =
  <E extends unknown[], T extends unknown[] = { [K in keyof E]?: E[K] }>(
    ...fns: (((...args: T) => void) | (() => void) | undefined)[]
  ) =>
  (...args: T) =>
    fns.forEach((fn) => fn?.(...args));

export class CustomError {
  _data;

  constructor(message: { message: string }) {
    this._data = message;
  }

  get data() {
    let mes = this._data.message;
    if (typeof mes !== 'string') {
      mes = 'Что то пошло не так';
    }
    this._data.message = mes;

    return this._data;
  }
}
