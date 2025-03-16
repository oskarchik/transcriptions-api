/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../error/ApiError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.httpCode).send({
      error: {
        message: err.message,
        code: err.httpCode,
      },
    });
  }

  return res.status(500).send({
    error: {
      message: ApiError.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      code: 500,
    },
  });
};
