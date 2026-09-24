import { describe, it, expect } from 'vitest';
import { generateRoomCode, isValidRoomCode } from '../utils/room-code.js';
import { roomIdSchema } from '../validators/common.validator.js';

describe('Room Code Utils & Validation', () => {
  it('generateRoomCode returns 6 valid chars', () => {
    const code = generateRoomCode();
    expect(code).toHaveLength(6);
    expect(isValidRoomCode(code)).toBe(true);
  });

  it('roomIdSchema accepts valid 6-char room codes', () => {
    const validCode = 'ABCDEF';
    const result = roomIdSchema.safeParse(validCode);
    expect(result.success).toBe(true);
  });

  it('roomIdSchema rejects lowercase characters', () => {
    const result = roomIdSchema.safeParse('abcdef');
    expect(result.success).toBe(false);
  });

  it('roomIdSchema rejects ambiguous characters (0, O, 1, I)', () => {
    expect(roomIdSchema.safeParse('ABCDE0').success).toBe(false);
    expect(roomIdSchema.safeParse('ABCDEO').success).toBe(false);
    expect(roomIdSchema.safeParse('ABCDE1').success).toBe(false);
    expect(roomIdSchema.safeParse('ABCDEI').success).toBe(false);
  });

  it('roomIdSchema rejects invalid lengths', () => {
    expect(roomIdSchema.safeParse('ABCDE').success).toBe(false);
    expect(roomIdSchema.safeParse('ABCDEFG').success).toBe(false);
  });
});
