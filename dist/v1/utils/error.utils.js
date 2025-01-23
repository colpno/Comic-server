"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error500 = exports.Error404 = exports.Error403 = exports.Error401 = exports.Error400 = exports.GeneralError = void 0;
class GeneralError extends Error {
    constructor({ message, code, error = true }) {
        super(message);
        this.code = code;
        this.error = error;
    }
}
exports.GeneralError = GeneralError;
/*
  400 - 499
*/
class Error400 extends GeneralError {
    constructor(message) {
        super({ message, code: 400 });
        this.name = 'BadRequestError';
    }
}
exports.Error400 = Error400;
class Error401 extends GeneralError {
    /**
     * @default message 'Unauthorized'
     */
    constructor(message = 'Unauthorized') {
        super({ message, code: 401 });
        this.name = 'UnauthorizedError';
    }
}
exports.Error401 = Error401;
class Error403 extends GeneralError {
    /**
     * @default message 'Forbidden'
     */
    constructor(message = 'Forbidden') {
        super({ message, code: 403 });
        this.name = 'ForbiddenError';
    }
}
exports.Error403 = Error403;
class Error404 extends GeneralError {
    /**
     * @default message 'Not Found'
     */
    constructor(message = 'Not Found') {
        super({ message, code: 404 });
        this.name = 'NotFoundError';
    }
}
exports.Error404 = Error404;
/*
  500 - 599
*/
class Error500 extends GeneralError {
    constructor(message) {
        super({ message, code: 500 });
        this.name = 'InternalServerError';
    }
}
exports.Error500 = Error500;
//# sourceMappingURL=error.utils.js.map