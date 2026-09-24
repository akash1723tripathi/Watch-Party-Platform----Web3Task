import { z } from 'zod';
import { ROOM_CODE_ALPHABET } from '../utils/room-code.js';

export const roomIdSchema = z
  .string()
  .length(6, 'Room ID must be exactly 6 characters')
  .regex(
    new RegExp(`^[${ROOM_CODE_ALPHABET}]{6}$`),
    'Room ID must contain only valid uppercase alphanumeric characters (excluding 0, O, 1, I)',
  );
