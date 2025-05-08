"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("./auth/auth.router");
const router = express_1.default.Router();
const appRoutes = [
    {
        path: "/auth",
        route: auth_router_1.Authrouter,
    }
];
appRoutes.forEach((route) => { router.use(route.path, route.route); });
exports.RootRouter = router;
