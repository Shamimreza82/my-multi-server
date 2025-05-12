"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./shared/utils/logger");
const db_1 = require("./shared/config/db");
const PORT = process.env.PORT || 3000;
// 1. Start the server
const server = http_1.default.createServer(app_1.default);
server.listen(PORT, () => {
    logger_1.logger.info(`Server listening on port ${PORT}`);
});
// 2. Centralized shutdown logic
const shutDown = (signal) => {
    logger_1.logger.info(`${signal} received: closing server gracefully…`);
    server.close((err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            logger_1.logger.error('Error closing HTTP server', err);
            process.exit(1);
        }
        try {
            // e.g. close DB connection
            yield db_1.prisma.$disconnect();
            logger_1.logger.info('Database connection closed.');
            process.exit(0);
        }
        catch (dbErr) {
            logger_1.logger.error('Error during database disconnect', dbErr);
            process.exit(1);
        }
    }));
    // in case server.close hangs
    setTimeout(() => {
        logger_1.logger.error('Forcefully shutting down.');
        process.exit(1);
    }, 30000).unref();
};
// 3. Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger_1.logger.error('UNCAUGHT EXCEPTION 💥:', err);
    shutDown('uncaughtException');
});
// 4. Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('UNHANDLED REJECTION 💥:', { reason, promise });
    shutDown('unhandledRejection');
});
// 5. Handle OS signals (Docker, Heroku, Ctrl-C, etc.)
['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => shutDown(signal));
});
