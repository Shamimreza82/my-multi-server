"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authrouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.AuthController.register);
router.get("/users", auth_controller_1.AuthController.getAllUsers);
router.get("/users/:id", auth_controller_1.AuthController.getSingleUser);
exports.Authrouter = router;
