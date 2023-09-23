import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UploadDropzone } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { X } from 'lucide-react';
import { ApiRoutes, AppRoutes } from '@/consts/enums';
import { useRouter } from 'next/navigation';

const defaultValues = {
  serverName: '',
  serverImage: ''
};

export type CreateServerFormBody = typeof defaultValues;

function CreateServerForm() {
  const form = useForm({
    defaultValues
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<CreateServerFormBody> = async (values) => {
    const res = await fetch(ApiRoutes.CreateServer, {
      method: 'POST',
      body: JSON.stringify(values)
    });

    if (res.ok) {
      const data = await res.json();
      router.push(AppRoutes.Server + `/${data.serverId}`);
    } else {
      const r = await res.json();
      console.log(r);
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
                    config={{ mode: 'manual' }}
                    content={{
                      label: 'Перетащите или выберите картинку для сервера',
                      allowedContent: 'картинкa не более 4 Mb',
                      button: 'Загрузить картинку'
                    }}
                    appearance={{
                      button: 'w-1/2'
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
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className={'mx-auto my-4 block'}>Создать</Button>
      </form>
    </Form>
  );
}

export default CreateServerForm;
