import { z } from 'zod';
import { roomIdSchema } from './common.validator.js';

export const createRoomSchema = z.object({
  body: z.object({
    userId: z.string().trim().min(1, 'userId must not be empty'),
    username: z
      .string()
      .trim()
      .min(2, 'Username must be at least 2 characters')
      .max(24, 'Username cannot exceed 24 characters'),
  }),
});

export const getRoomSchema = z.object({
  params: z.object({
    code: z
      .string()
      .transform((val) => val.trim().toUpperCase())
      .pipe(roomIdSchema),
  }),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>['body'];
export type GetRoomParams = z.infer<typeof getRoomSchema>['params'];
