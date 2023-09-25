import Link from 'next/link';
import { AppRoutes } from '@/consts/enums';
import { checkAuth } from '@/lib/utils';
import React, { FunctionComponent } from 'react';

export default async function Home() {
  await checkAuth({ forApp: true });

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex items-center">
        <div className="container flex justify-center">
          <div className="space-y-4 p-2">
            <h1 className="text-4xl">Добро пожаловать на дискор-клон сайт</h1>
            <p>
              <Link className="mx-auto block text-center" href={AppRoutes.Signup}>
                Зарегистрироваться в два клика
              </Link>
            </p>
            <p>
              <Link className="mx-auto block text-center" href={AppRoutes.Signin}>
                Уже бывали ?
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
