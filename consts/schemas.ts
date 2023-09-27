import { z } from 'zod';
import { ChannelType } from '@prisma/client';

export const createChannelSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Введите название сервера' })
    .refine((name) => name !== 'general', 'Имя зарезервировано'),
  type: z.nativeEnum(ChannelType)
});
