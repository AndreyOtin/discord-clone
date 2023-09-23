'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { AppRoutes, RegisterFormVariant } from '@/consts/enums';
import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const schema = z.object({
  email: z.string().email({ message: 'Введите валидный емайл' }),
  password: z.string().min(3, { message: 'Введите мин 3 символа' })
});

type Schema = z.infer<typeof schema>;

type RegisterFormProps = {
  variant: RegisterFormVariant;
};

function RegisterForm(props: RegisterFormProps) {
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
      variant: props.variant,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-[300px] flex-col bg-white p-8">
        {error && !searchParams.get('error') ? (
          <div className="mb-4 text-center text-destructive">
            {props.variant === 'signin' ? (
              <span>Введен неверный пароль или емайл</span>
            ) : (
              <span>Такой емайл уже сущуствует</span>
            )}
          </div>
        ) : (
          error && (
            <div className="mb-4 text-center text-destructive">
              <span>Ошибка с Github</span>
            </div>
          )
        )}
        <Button onClick={handleGithubClick} type="button" className="flex space-x-2">
          <Github color="white" absoluteStrokeWidth />
          <span>Github</span>
        </Button>
        <Separator className="relative my-8 bg-primary">
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">или</span>
        </Separator>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Введите eмайл</FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-300" />
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
                <Input {...field} className="bg-gray-300" type={'password'} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="mt-5 self-center">Отправить</Button>
      </form>
    </Form>
  );
}

export default RegisterForm;
