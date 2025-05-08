/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  console.error(err);






  res
    .status(err.statusCode ?? 500)
    .json(
      {
        success: false,
        message: err.message ?? 'Internal Server Error',
        error: err ?? 'Something went wrong',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      }
    );

}
// 