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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const register = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.register(req.body);
    res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: {
            user: result,
        },
    });
}));
const login = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = yield auth_service_1.AuthService.login(req.body);
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    res.cookie('accessToken', token, cookieOptions);
    res.status(201).json({
        status: "success",
        message: "User Login successfully",
        data: { accessToken: token },
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    console.log(user);
    const result = yield auth_service_1.AuthService.getAllUsers();
    res.status(201).json({
        status: "success",
        message: "get all users successfully",
        data: result
    });
}));
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield auth_service_1.AuthService.getSingleUser(id);
    res.status(201).json({
        status: "success",
        message: "get single user successfully",
        data: result
    });
}));
exports.AuthController = {
    register,
    getAllUsers,
    getSingleUser,
    login
};
