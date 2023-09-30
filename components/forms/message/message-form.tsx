'use client';
import React from 'react';
import { callAll, cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

type MessageFormProps = {
  className: string;
  channelId: string;
  serverId: string;
};

export const messageSchema = z.object({
  content: z.string().min(1, { message: 'Введите сообщение' })
});

export type MessageForm = z.infer<typeof messageSchema>;

const MessageForm = ({ className, channelId, serverId }: MessageFormProps) => {
  const form = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ''
    }
  });

  const onSubmit: SubmitHandler<MessageForm> = (values) => {
    const url = new URL(window.location.origin + '/api/messages');
    url.searchParams.set('channelId', channelId);
    url.searchParams.set('serverId', serverId);

    void fetch(url, {
      method: 'POST',
      body: JSON.stringify(values)
    });
  };

  return (
    <Form {...form}>
      <form className={cn(className)} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={'content'}
          render={({ field }) => (
            <FormItem className={''}>
              <FormLabel className={'sr-only'}>Введите сообщение</FormLabel>
              <div className={'w-[80%] mx-auto relative'}>
                <FormMessage className={'absolute top-1/2 left-4 -translate-y-1/2'} />
                <FormControl>
                  <Input
                    {...field}
                    className={' pr-16'}
                    onBlur={callAll(() => {
                      form.clearErrors();
                    }, field.onBlur)}
                  />
                </FormControl>
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  className={
                    'absolute top-1/2 right-4 -translate-y-1/2 aspect-square h-full w-auto '
                  }
                >
                  <Smile />
                </Button>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MessageForm;
