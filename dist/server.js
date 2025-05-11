"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = require("./shared/middlewares/globalErrorHandler");
const rootRouter_1 = require("./shared/rootRouter");
const logger_1 = require("./shared/utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: (_a = process.env.CORS_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',') }));
// connect your routers
app.use('/api/v1', rootRouter_1.RootRouter);
// simple health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success', // overall result
        timestamp: new Date().toISOString(), // when this response was generated
        uptime: process.uptime(), // seconds since the app started
        version: process.env.nPM_PACKAGE_VERSION, // your package.json version
        environment: process.env.NODE_ENV, // e.g. “development” or “production”
        data: {
            message: 'API is up and running! 🚀'
        }
    });
});
// 404 for any other route
// app.all('*', (req, res, next) => {
//   next(new AppError(404, `Cannot find ${req.originalUrl} on this server`));
// });
// global error handler
app.use(globalErrorHandler_1.globalErrorHandler);
// handle uncaught exceptions & rejections
process.on('uncaughtException', (err) => {
    logger_1.logger.error('UNCAUGHT EXCEPTION 💥', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('UNHANDLED REJECTION 💥', reason);
    // optionally: server.close(() => process.exit(1));
});
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    logger_1.logger.info(`🚀 Server listening on http://localhost:${PORT}`);
});
