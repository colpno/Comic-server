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

  constructor(message: string = 'Unauthorized') {
    super({ message, code: 401 });
  }
}

export class Error403 extends GeneralError {
  name: string = 'ForbiddenError';

  constructor(message: string = 'Forbidden') {
    super({ message, code: 403 });
  }
}

export class Error404 extends GeneralError {
  name: string = 'NotFoundError';

  constructor(message: string = 'Not Found') {
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
