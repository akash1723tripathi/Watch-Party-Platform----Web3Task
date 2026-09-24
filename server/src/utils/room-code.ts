import crypto from 'node:crypto';

export const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateRoomCode = (): string => {
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = crypto.randomInt(0, ROOM_CODE_ALPHABET.length);
    result += ROOM_CODE_ALPHABET[randomIndex];
  }
  return result;
};

export const isValidRoomCode = (code: string): boolean => {
  if (typeof code !== 'string' || code.length !== 6) {
    return false;
  }
  return /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(code);
};
