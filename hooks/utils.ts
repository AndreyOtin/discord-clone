import { useRouter } from 'next/navigation';

export const use404 = () => {
  const router = useRouter();
  const id = crypto.randomUUID();

  return () => router.push('/not-found/' + id);
};
