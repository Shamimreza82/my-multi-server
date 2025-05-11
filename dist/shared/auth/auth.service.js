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
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const AppError_1 = require("../utils/AppError");
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.user.create({
        data: Object.assign({}, payload)
    });
    return result;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.user.findUnique({
        where: {
            email: payload.email,
            password: payload.password
        }
    });
    if (!result) {
        throw new AppError_1.AppError(404, "Invalid email or password");
    }
    const jwtPayload = {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
    console.log(token);
    return { token };
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.user.findMany();
    return result;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.user.findUnique({
        where: { id }
    });
    return result;
});
exports.AuthService = {
    register,
    getAllUsers,
    getSingleUser,
    login
};
