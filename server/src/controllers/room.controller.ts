import type { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/room.service.js';

export class RoomController {
  static createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, username } = req.body;
      const room = await RoomService.createRoom({ userId, username });

      res.status(201).json({
        success: true,
        data: room,
      });
    } catch (error) {
      next(error);
    }
  };

  static getRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const code = String(req.params.code);
      const room = await RoomService.getRoomByCode(code);

      res.status(200).json({
        success: true,
        data: room,
      });
    } catch (error) {
      next(error);
    }
  };
}
