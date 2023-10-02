import React, { startTransition, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UploadDropzone } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Loader2, X } from 'lucide-react';
import { ApiRoute, AppRoutes } from '@/consts/enums';
import { useRouter } from 'next/navigation';
import { useModalContext } from '@/contexts/modal-context/modal-context';
import { Server } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';
import { CustomError } from '@/lib/utils';

const defaultValues = {
  serverName: '',
  serverImage: ''
};

export type CreateServerFormBody = typeof defaultValues;

type CreateServerFormProps = {
  server?: Server;
};

function CreateServerForm({ server }: CreateServerFormProps) {
  const form = useForm({
    defaultValues
  });
  const router = useRouter();
  const { closeModal } = useModalContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (server) {
      form.setValue('serverImage', server.imageUrl);
      form.setValue('serverName', server.name);
    }
  }, [form, server]);

  const onSubmit: SubmitHandler<CreateServerFormBody> = async (values) => {
    setIsLoading(true);

    const postConfig: RequestInit = {
      method: 'POST',
      body: JSON.stringify(values)
    };

    const patchConfig: RequestInit = {
      method: 'PATCH',
      body: JSON.stringify({
        serverId: server?.id,
        ...values
      })
    };

    try {
      const response = await fetch(ApiRoute.CreateServer, server ? patchConfig : postConfig);

      if (!response.ok) {
        const message = await response.json();
        throw new CustomError({ message });
      }

      closeModal();
      const data = await response.json();
      startTransition(() => {
        router.push(AppRoutes.App + `/${data.id}`);
        router.refresh();
      });
    } catch (e) {
      if (e instanceof CustomError) {
        return toast({
          title: 'Что то пошло не так',
          description: e.data.message,
          variant: 'destructive'
        });
      }

      toast({
        title: 'Что то пошло не так',
        variant: 'destructive'
      });
    } finally {
      startTransition(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={'serverImage'}
          render={({ field }) => (
            <FormItem className={'mb-4'}>
              <FormMessage />
              <FormControl>
                {field.value ? (
                  <div className="relative mx-auto h-20 w-20">
                    <Image className={'rounded-full'} fill src={field.value} alt="server icon" />
                    <button
                      onClick={() => field.onChange('')}
                      className={'absolute right-0 top-0 z-20 rounded-full bg-amber-600'}
                    >
                      <X />
                    </button>
                  </div>
                ) : (
                  <UploadDropzone
                    onClientUploadComplete={(file) => {
                      field.onChange(file?.[0].url);
                    }}
                    onUploadError={({ message }) => {
                      form.setError('serverImage', { message });
                    }}
                    config={{ mode: 'auto' }}
                    content={{
                      label: 'Перетащите или выберите картинку для сервера',
                      allowedContent: 'картинкa не более 4 Mb',
                      button: 'Загрузить картинку'
                    }}
                    appearance={{
                      button: 'hidden'
                    }}
                    endpoint={'imageUploader'}
                  />
                )}
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'serverName'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Введите название сервера</FormLabel>
              <FormControl>
                <Input {...field} minLength={3} required />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className={'mx-auto my-4 block flex gap-x-2'} disabled={isLoading}>
          {isLoading && <Loader2 className={'animate-spin'} />}
          {server ? 'Обновить' : 'Создать'}
        </Button>
      </form>
    </Form>
  );
}

export default CreateServerForm;
