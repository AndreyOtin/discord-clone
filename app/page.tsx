'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { AppRoutes } from '@/consts/enums';

export default function Home() {
  const session = useSession();

  console.log(session);
  return (
    <main>
      <div className="container">
        <h1>Добро пожаловать на Дискор клон сайта</h1>
        <p>
          <Link href={AppRoutes.Signup}>Зарегистрировать в два клика</Link>
        </p>
        <p>
          <Link href={AppRoutes.Signin}>Уже бывали ?</Link>
        </p>
      </div>
    </main>
  );
}
