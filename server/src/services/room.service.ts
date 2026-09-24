import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { ApiError } from '../utils/api-error.js';
import { generateRoomCode } from '../utils/room-code.js';
import type { CreateRoomDto, RoomResponse } from '../types/room.types.js';

export class RoomService {
  private static readonly MAX_CODE_GENERATION_RETRIES = 5;

  /**
   * Creates a new room with a unique 6-character code.
   * Retries up to 5 times on code collision before failing.
   */
  static async createRoom(dto: CreateRoomDto): Promise<RoomResponse> {
    const hostId = dto.userId; // TODO(stage-4): identity comes from the verified token, never from the body (AUTH-06)

    for (let attempt = 0; attempt < this.MAX_CODE_GENERATION_RETRIES; attempt++) {
      const code = generateRoomCode();

      try {
        const room = await prisma.room.create({
          data: {
            code,
            hostId,
          },
        });

        return {
          code: room.code,
          hostId: room.hostId,
        };
      } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          // Unique constraint violation on code -> retry with another code
          continue;
        }
        throw error;
      }
    }

    throw ApiError.internal('Failed to generate a unique room code. Please try again.', 'ROOM_CREATION_FAILED');
  }

  /**
   * Retrieves a room by its normalized 6-character code.
   */
  static async getRoomByCode(code: string): Promise<RoomResponse> {
    const room = await prisma.room.findUnique({
      where: { code },
    });

    if (!room) {
      throw ApiError.notFound(`Room with code ${code} not found`, 'ROOM_NOT_FOUND');
    }

    return {
      code: room.code,
      hostId: room.hostId,
    };
  }
}
