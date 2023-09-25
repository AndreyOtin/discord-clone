'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { AppRoutes } from '@/consts/enums';
import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const schema = z.object({
  email: z.string().email({ message: 'Введите валидный емайл' }),
  password: z.string().min(3, { message: 'Введите мин 3 символа' })
});

type Schema = z.infer<typeof schema>;

function InvitePeopleForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  });
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<Schema> = async (value) => {
    const res = await signIn('credentials', {
      ...value,
      redirect: false,
      callbackUrl: AppRoutes.App
    });

    if (res && res.error) {
      setError(true);
    } else {
      return router.push(AppRoutes.App);
    }
  };

  const handleGithubClick = async () => {
    await signIn('github', {
      callbackUrl: AppRoutes.App
    });
  };

  useEffect(() => {
    const err = searchParams.get('error');

    if (err) {
      setError(true);
    }
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-[300px] flex-col border border-primary bg-background p-8"
      >
        <Button onClick={handleGithubClick} type="button" className="flex space-x-2">
          <Github absoluteStrokeWidth />
          <span>Github</span>
        </Button>
        <Separator className="relative my-8 bg-primary">
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background">
            или
          </span>
        </Separator>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className={'mb-3'}>
              <FormLabel>Введите eмайл</FormLabel>
              <FormControl>
                <Input {...field} className={'border-primary'} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Введите пароль</FormLabel>
              <FormControl>
                <Input {...field} type={'password'} className={'border-primary'} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="mt-5 self-center">Отправить</Button>
      </form>
    </Form>
  );
}

export default InvitePeopleForm;
