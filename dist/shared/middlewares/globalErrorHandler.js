"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
function globalErrorHandler(err, req, res, next) {
    console.error(err);
    res.status(err.statusCode ?? 500)
        .json({ message: err.message ?? 'Internal Server Error' });
}
