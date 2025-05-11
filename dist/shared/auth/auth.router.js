"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authrouter = void 0;
const auth_1 = require("../middlewares/auth");
const auth_controller_1 = require("./auth.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/register", auth_controller_1.AuthController.register);
router.post("/login", auth_controller_1.AuthController.login);
router.get("/users", (0, auth_1.auth)('USER'), auth_controller_1.AuthController.getAllUsers);
router.get("/users/:id", auth_controller_1.AuthController.getSingleUser);
exports.Authrouter = router;
