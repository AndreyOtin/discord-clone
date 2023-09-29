'use client';

import React, { startTransition, useEffect, useState } from 'react';
import { useModalContext } from '@/contexts/modal-context/modal-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ChannelType } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ApiRoutes } from '@/consts/enums';
import { createChannelSchema } from '@/consts/schemas';
import { Loader2 } from 'lucide-react';
import { use404 } from '@/hooks/utils';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type Form = z.infer<typeof createChannelSchema>;

const methodToName = {
  'POST': 'Создать',
  'PATCH': 'Изменить',
  'DELETE': 'Удалить'
};

function CreateChannel() {
  const form = useForm<Form>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: '',
      type: 'TEXT'
    }
  });
  const { modal, closeModal, data } = useModalContext();
  const to404 = use404();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data.type) {
      form.setValue('type', data.type);
    }
    if (data.channel && form) {
      form.setValue('name', data.channel.channel?.name || '');
    }
  }, [data, form]);

  const onSubmit: SubmitHandler<Form> = async (values) => {
    console.log('123');
    const url = new URL(window.location.origin + ApiRoutes.Channel);
    url.searchParams.set('serverId', data.server?.id || '');
    url.searchParams.set('channelId', data.channel?.channel?.id || '');

    const response = await fetch(url, {
      method: data.channel ? data.channel.method : 'POST',
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      to404();
    } else {
      startTransition(() => {
        handleClose();
        router.refresh();
      });
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const url = new URL(window.location.origin + ApiRoutes.Channel);
    url.searchParams.set('serverId', data.server?.id || '');
    url.searchParams.set('channelId', data.channel?.channel?.id || '');
    console.log(url);
    const response = await fetch(url, {
      method: 'DELETE'
    });

    if (!response.ok) {
      to404();
    } else {
      startTransition(() => {
        handleClose();
        router.refresh();
      });
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    closeModal();
    form.reset();
  };

  return (
    <Dialog open={modal === 'createChannel'} onOpenChange={handleClose}>
      <DialogContent overlayClassName="bg-background/2">
        <DialogHeader className={'space-y-4'}>
          {data.channel?.method === 'DELETE' && <DialogTitle>Удалить канал</DialogTitle>}
          {data.channel?.method === 'PATCH' && <DialogTitle> Изменить канал</DialogTitle>}
          {data.channel?.method === 'POST' && <DialogTitle> Создать канал</DialogTitle>}
        </DialogHeader>
        {data.channel?.method === 'DELETE' && (
          <Button onClick={handleDelete}>
            {isLoading ? (
              <Loader2 className={'animate-spin'} />
            ) : (
              methodToName[data.channel?.method || 'POST']
            )}
          </Button>
        )}
        {data.channel?.method !== 'DELETE' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6')}>
              <FormField
                control={form.control}
                name={'name'}
                render={({ field }) => (
                  <FormItem className={`space-y-2`}>
                    <FormLabel>Введите название</FormLabel>
                    <FormControl>
                      <Input {...field} className={'border-primary'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={'type'}
                render={({ field, formState }) => (
                  <FormItem className={`space-y-2`}>
                    <FormLabel>Выберите тип канала</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={formState.isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className={'capitalize'}>
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((c) => (
                          <SelectItem
                            key={c}
                            value={c}
                            className={'cursor-pointer hover:bg-primary/10 capitalize'}
                          >
                            {c.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className={'relative'}>
                {form.formState.isSubmitting ? (
                  <Loader2 className={'animate-spin'} />
                ) : (
                  methodToName[data.channel?.method || 'POST']
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreateChannel;