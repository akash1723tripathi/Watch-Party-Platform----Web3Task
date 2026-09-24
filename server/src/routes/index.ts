import { Router } from 'express';
import roomRoutes from './room.routes.js';

const router = Router();

router.use('/rooms', roomRoutes);

export default router;
