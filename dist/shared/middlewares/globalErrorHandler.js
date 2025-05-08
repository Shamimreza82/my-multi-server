"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
function globalErrorHandler(err, req, res, 
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
next) {
    var _a, _b;
    console.error(err);
    res
        .status((_a = err.statusCode) !== null && _a !== void 0 ? _a : 500)
        .json({
        success: false,
        message: (_b = err.message) !== null && _b !== void 0 ? _b : 'Internal Server Error',
        error: err !== null && err !== void 0 ? err : 'Something went wrong',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
}
// 
