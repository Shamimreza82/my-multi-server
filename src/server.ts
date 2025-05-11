
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './shared/middlewares/globalErrorHandler';
import { RootRouter } from './shared/rootRouter';
import { logger } from './shared/utils/logger';



dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') }));



// connect your routers
app.use('/api/v1', RootRouter);



// simple health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',                         // overall result
    timestamp: new Date().toISOString(),       // when this response was generated
    uptime: process.uptime(),                  // seconds since the app started
    version: process.env.nPM_PACKAGE_VERSION,  // your package.json version
    environment: process.env.NODE_ENV,         // e.g. “development” or “production”
    data: {                                    // reserved for any future payload
      message: 'API is up and running! 🚀'
    }
  });
});




// 404 for any other route
// app.all('*', (req, res, next) => {
//   next(new AppError(404, `Cannot find ${req.originalUrl} on this server`));
// });



// global error handler
app.use(globalErrorHandler);



// handle uncaught exceptions & rejections
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION 💥', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED REJECTION 💥', reason);
  // optionally: server.close(() => process.exit(1));
});



const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server listening on http://localhost:${PORT}`);
});



