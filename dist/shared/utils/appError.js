"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const AppError = class extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
};
exports.AppError = AppError;
