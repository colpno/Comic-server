import { Request } from 'express';

import { ErrorResponseMetadata } from '../types/api.type';

interface GeneralErrorProps {
  message: string;
  code: number;
  error?: boolean;
}

export class GeneralError extends Error {
  code: GeneralErrorProps['code'];
  error: Exclude<GeneralErrorProps['error'], undefined>;

  constructor({ message, code, error = true }: GeneralErrorProps) {
    super(message);
    this.code = code;
    this.error = error;
  }
}

/*
  400 - 499
*/

export class Error400 extends GeneralError {
  name: string = 'BadRequestError';

  constructor(message: string) {
    super({ message, code: 400 });
  }
}

export class Error401 extends GeneralError {
  name: string = 'UnauthorizedError';

  constructor(message: string) {
    super({ message, code: 401 });
  }
}

export class Error403 extends GeneralError {
  name: string = 'ForbiddenError';

  constructor(message: string) {
    super({ message, code: 403 });
  }
}

export class Error404 extends GeneralError {
  name: string = 'NotFoundError';

  constructor(message: string) {
    super({ message, code: 404 });
  }
}

/*
  500 - 599
*/

export class Error500 extends GeneralError {
  name: string = 'InternalServerError';

  constructor(message: string) {
    super({ message, code: 500 });
  }
}

export const generateErrorMetadata = (
  req: Request,
  overide?: Partial<ErrorResponseMetadata>
): ErrorResponseMetadata => ({
  requestId: req.headers['x-request-id'] as string,
  timestamp: new Date().toISOString(),
  endpoint: req.url,
  httpMethod: req.method,
  stackTrace: '',
  errorName: '',
  environment: process.env.NODE_ENV as string,
  ...overide,
});
