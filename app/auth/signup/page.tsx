'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  email: z.string().email({ message: 'Введите валидный емайл' }),
  password: z.string().min(3, { message: 'Введите мин 3 символа' })
});

type Schema = z.infer<typeof schema>;

function Signup() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit: SubmitHandler<Schema> = (value) => {
    console.log(value);
  };

  return (
    <main>
      <div className="container flex min-h-screen items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-[300px] flex-col bg-white p-8"
          >
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
                    <Input
                      {...field}
                      className="bg-gray-300"
                      type={'password'}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="mt-5 self-center">Отправить</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}

export default Signup;
