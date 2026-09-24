import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { globalRateLimiter } from './middleware/rate-limiter.middleware.js';
import { notFoundHandler } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';
import { healthRoutes } from './routes/health.routes.js';
import apiRoutes from './routes/index.js';

const app = express();

// 1. Trust proxy (prod)
if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// 2. Helmet
app.use(helmet());

// 3. CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// 4. Rate limit
app.use(globalRateLimiter);

// 5. Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// 6. Cookies
app.use(cookieParser());

// 7. Request logger
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip }, 'Incoming HTTP request');
  next();
});

// 8. Health check endpoint (unauthenticated)
app.use('/health', healthRoutes);

// 9. API v1 router
app.use('/api/v1', apiRoutes);

// 10. Not found handler
app.use(notFoundHandler);

// 11. Error handler
app.use(errorHandler);

export default app;
