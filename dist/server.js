"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { ecommerceRouter } from './modules/ecommerce/module';
// import { blogRouter } from './modules/blog/module';
// import { hobbyRouter } from './modules/hobby/module';
// import swaggerUi from 'swagger-ui-express';
// import swaggerDoc from './swagger.json';
const globalErrorHandler_1 = require("./shared/middlewares/globalErrorHandler");
const rootRouter_1 = require("./shared/rootRouter");
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
app.use((0, cors_1.default)({ origin: (_a = process.env.CORS_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',') }));
app.use('/api/v1', rootRouter_1.RootRouter);
// global error handler
app.use(globalErrorHandler_1.globalErrorHandler);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
console.log(`CORS_ORIGINS: ${process.env.CORS_ORIGINS}`);
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
