import { Router } from 'express';
import { RoomController } from '../controllers/room.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createRoomRateLimiter } from '../middleware/rate-limiter.middleware.js';
import { createRoomSchema, getRoomSchema } from '../validators/room.validator.js';

const router = Router();

router.post('/', createRoomRateLimiter, validate(createRoomSchema), RoomController.createRoom);
router.get('/:code', validate(getRoomSchema), RoomController.getRoom);

export default router;
