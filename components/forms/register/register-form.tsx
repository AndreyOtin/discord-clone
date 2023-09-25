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
import { Github, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email({ message: 'Введите валидный емайл' }),
  name: z.string().min(2, { message: 'Введите мин 2 символа' }),
  password: z.string().min(3, { message: 'Введите мин 3 символа' })
});

const signInSchema = z.object({
  email: z.string().email({ message: 'Введите валидный емайл' }),
  password: z.string().min(3, { message: 'Введите мин 3 символа' })
});

type Schema = z.infer<typeof schema>;

type RegisterFormProps = {
  variant: RegisterFormVariant;
};

function RegisterForm(props: RegisterFormProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(props.variant === 'signin' ? signInSchema : schema),
    defaultValues: { email: '', password: '', name: '' }
  });
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const res = await signIn('github', {
      callbackUrl: AppRoutes.App,
      redirect: false
    });

    if (res && res.error) {
      setError(true);
    } else {
      return router.push(AppRoutes.App);
    }

    setIsLoading(false);
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
          {isLoading ? (
            <RefreshCw className={cn('animate-spin')} />
          ) : (
            <Github absoluteStrokeWidth />
          )}

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
          render={({ field, fieldState }) => (
            <FormItem className={'mb-3'}>
              {fieldState.error && (
                <p className={'text-destructive text-sm'}>{fieldState.error.message}</p>
              )}
              <FormLabel>Введите eмайл</FormLabel>
              <FormControl>
                <Input {...field} className={'border-primary'} />
              </FormControl>
            </FormItem>
          )}
        />
        {props.variant === 'signup' && (
          <FormField
            control={form.control}
            name={'name'}
            render={({ field, fieldState }) => (
              <FormItem className={'mb-3'}>
                {fieldState.error && (
                  <p className={'text-destructive text-sm'}>{fieldState.error.message}</p>
                )}
                <FormLabel>Введите имя</FormLabel>
                <FormControl>
                  <Input {...field} type={'text'} className={'border-primary'} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              {fieldState.error && (
                <p className={'text-destructive text-sm'}>{fieldState.error.message}</p>
              )}
              <FormLabel>Введите пароль</FormLabel>
              <FormControl>
                <Input {...field} type={'password'} className={'border-primary'} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="mt-5 min-w-full self-center">
          {form.formState.isSubmitting ? <RefreshCw className={cn('animate-spin')} /> : 'Отправить'}
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;
