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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EmojiPicker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useThemeContext } from '@/contexts/theme-context/theme-context';
import { Channel } from '@prisma/client';

type MessageFormProps = {
  className: string;
  channel: Channel;
  serverId: string;
};

export const messageSchema = z.object({
  content: z.string().min(1, { message: 'Введите сообщение' })
});

export type MessageForm = z.infer<typeof messageSchema>;

const MessageForm = ({ className, channel, serverId }: MessageFormProps) => {
  const { theme } = useThemeContext();
  const form = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ''
    }
  });

  const onSubmit: SubmitHandler<MessageForm> = async (values) => {
    const url = new URL(window.location.origin + '/api/messages');
    url.searchParams.set('channelId', channel.id);
    url.searchParams.set('serverId', serverId);

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(values)
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form className={cn(className)} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={'content'}
          render={({ field, formState }) => (
            <FormItem className={''}>
              <FormLabel className={'sr-only'}>Введите сообщение</FormLabel>
              <div className={'w-[80%] mx-auto relative'}>
                <FormMessage className={'absolute top-1/2 left-4 -translate-y-1/2'} />
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`Сообщение #${channel.name}`}
                    disabled={formState.isSubmitting}
                    className={' pr-16'}
                    onBlur={callAll(() => {
                      form.clearErrors();
                    }, field.onBlur)}
                  />
                </FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={formState.isSubmitting}
                      variant={'ghost'}
                      size={'icon'}
                      className={
                        'absolute top-1/2 right-4 -translate-y-1/2 aspect-square h-full w-auto '
                      }
                    >
                      <Smile />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <EmojiPicker
                      theme={theme}
                      data={data}
                      onEmojiSelect={(v: { native: string }) =>
                        field.onChange(`${field.value}${v.native}`)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MessageForm;
