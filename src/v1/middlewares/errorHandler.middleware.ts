import { config } from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import { FailedResponseContent } from '../types/api.type';
import { GeneralError } from '../utils/error.utils';
import { generateErrorMetadata } from '../utils/meta.util';

config();

const errorHandler = (error: unknown, req: Request, res: Response, _?: NextFunction): void => {
  if (error instanceof MongooseError) {
    const { message, name, stack } = error;

    const data: FailedResponseContent = {
      code: 500,
      error: true,
      reason: message,
    };
    if (process.env.NODE_ENV !== 'production') {
      data.metadata = generateErrorMetadata(req, { errorName: name, stackTrace: stack || '' });
    }

    // INFO: Implement logger if deployed on an appropriate platform and plan
    console.error(data);

    res.status(data.code).json(data);
    return;
  }

  if (typeof error === 'string') {
    const data: FailedResponseContent = {
      code: 500,
      error: true,
      reason: error,
    };
    if (process.env.NODE_ENV !== 'production') {
      data.metadata = generateErrorMetadata(req);
    }

    // INFO: Implement logger if deployed on an appropriate platform and plan
    console.error(data);

    res.status(data.code).json(data);
    return;
  }

  if (error instanceof GeneralError) {
    const { code, message: reason, error: isError, name, stack } = error;

    const data: FailedResponseContent = {
      code,
      error: isError,
      reason,
    };
    if (process.env.NODE_ENV !== 'production') {
      data.metadata = generateErrorMetadata(req, { errorName: name, stackTrace: stack || '' });
    }

    // INFO: Implement logger if deployed on an appropriate platform and plan
    isError && console.error(data);

    res.status(data.code).json(data);
    return;
  }

  if (error instanceof Error) {
    const { stack, message: reason, name } = error;

    const data: FailedResponseContent = {
      code: 500,
      error: true,
      reason,
    };
    if (process.env.NODE_ENV !== 'production') {
      data.metadata = generateErrorMetadata(req, { errorName: name, stackTrace: stack ?? '' });
    }

    // INFO: Implement logger if deployed on an appropriate platform and plan
    console.error(data);

    res.status(data.code).json(data);
    return;
  }

  const data: FailedResponseContent = {
    code: 500,
    error: true,
    reason: 'Unknown error',
  };
  if (process.env.NODE_ENV !== 'production') {
    data.metadata = generateErrorMetadata(req);
  }

  // INFO: Implement logger if deployed on an appropriate platform and plan
  console.error(data);

  res.status(data.code).json(data);
  return;
};

export default errorHandler;
