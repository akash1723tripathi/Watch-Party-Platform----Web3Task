import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};
