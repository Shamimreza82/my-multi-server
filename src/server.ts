/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "http";
import app from "./app";
import { logger } from "./shared/utils/logger";
import { prisma } from "./shared/config/db";




const PORT = process.env.PORT || 3000;

// 1. Start the server
const server = http.createServer(app);
server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});


// 2. Centralized shutdown logic
const shutDown = (signal: any) => {
  logger.info(`${signal} received: closing server gracefully…`);
  server.close(async (err) => {
    if (err) {
      logger.error('Error closing HTTP server', err);
      process.exit(1);
    }
    try {
      // e.g. close DB connection
      await prisma.$disconnect();
      logger.info('Database connection closed.');
      process.exit(0);
    } catch (dbErr) {
      logger.error('Error during database disconnect', dbErr);
      process.exit(1);
    }
  });

  // in case server.close hangs
  setTimeout(() => {
    logger.error('Forcefully shutting down.');
    process.exit(1);
  }, 30_000).unref();
};

// 3. Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION 💥:', err);
  shutDown('uncaughtException');
});

// 4. Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED REJECTION 💥:', { reason, promise });
  shutDown('unhandledRejection');
});

// 5. Handle OS signals (Docker, Heroku, Ctrl-C, etc.)
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => shutDown(signal));
});


