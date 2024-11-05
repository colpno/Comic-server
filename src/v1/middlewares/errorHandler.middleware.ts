import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import { HTTP_500_SERVER_ERROR } from '../../constants/httpCode.constant';
import { APP_ENVIRONMENT } from '../configs/common.conf';
import { FailedResponse } from '../types/api.type';
import { GeneralError } from '../utils/error.utils';
import { generateErrorMetadata } from '../utils/meta.util';

const isProduction = APP_ENVIRONMENT === 'production';

const errorHandler = (error: unknown, req: Request, res: Response, _?: NextFunction): void => {
  if (error instanceof MongooseError) {
    const { message, name, stack } = error;

    const data: FailedResponse = {
      code: HTTP_500_SERVER_ERROR,
      error: true,
      reason: message,
    };
    if (!isProduction) {
      data.metadata = generateErrorMetadata(req, { errorName: name, stackTrace: stack || '' });
    }

    // INFO: Implement logger if deployed on an appropriate platform and plan
    console.error(data);

    res.status(data.code).json(data);
    return;
  }

  if (typeof error === 'string') {
    const data: FailedResponse = {
      code: HTTP_500_SERVER_ERROR,
      error: true,
      reason: error,
    };
    if (!isProduction) {
      data.metadata = generateErrorMetadata(req);
    }

    // INFO: Implement logger if deployed on an appropriate platform and plan
    console.error(data);

    res.status(data.code).json(data);
    return;
  }

  if (error instanceof GeneralError) {
    const { code, message: reason, error: isError, name, stack } = error;

    const data: FailedResponse = {
      code,
      error: isError,
      reason,
    };
    if (!isProduction) {
      data.metadata = generateErrorMetadata(req, { errorName: name, stackTrace: stack || '' });
    }

    // INFO: Implement logger if deployed on an appropriate platform and plan
    isError && console.error(data);

    res.status(data.code).json(data);
    return;
  }

  if (
    error instanceof Error &&
    'code' in error &&
    error.code === 'EBADCSRFTOKEN' &&
    'statusCode' in error
  ) {
    const { stack, message: reason, name, statusCode } = error;

    const data: FailedResponse = {
      code: statusCode as number,
      error: true,
      reason,
    };
    if (!isProduction) {
      data.metadata = generateErrorMetadata(req, { errorName: name, stackTrace: stack ?? '' });
    }

    // INFO: Implement logger if deployed on an appropriate platform and plan
    console.error(data);

    res.status(data.code).json(data);
    return;
  }

  if (error instanceof Error) {
    const { stack, message: reason, name } = error;

    const data: FailedResponse = {
      code: HTTP_500_SERVER_ERROR,
      error: true,
      reason,
    };
    if (!isProduction) {
      data.metadata = generateErrorMetadata(req, { errorName: name, stackTrace: stack ?? '' });
    }

    // INFO: Implement logger if deployed on an appropriate platform and plan
    console.error(data);

    res.status(data.code).json(data);
    return;
  }

  const data: FailedResponse = {
    code: HTTP_500_SERVER_ERROR,
    error: true,
    reason: 'Unknown error',
  };
  if (!isProduction) {
    data.metadata = generateErrorMetadata(req);
  }

  // INFO: Implement logger if deployed on an appropriate platform and plan
  console.error(data);

  res.status(data.code).json(data);
  return;
};

export default errorHandler;
