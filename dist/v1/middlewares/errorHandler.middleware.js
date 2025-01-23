"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const httpCode_constant_1 = require("../../constants/httpCode.constant");
const common_conf_1 = require("../configs/common.conf");
const error_utils_1 = require("../utils/error.utils");
const meta_util_1 = require("../utils/meta.util");
const isProduction = common_conf_1.APP_ENVIRONMENT === 'production';
const errorHandler = (error, req, res, _) => {
    if (error instanceof mongoose_1.Error) {
        const { message, name, stack } = error;
        const data = {
            code: httpCode_constant_1.HTTP_500_SERVER_ERROR,
            error: true,
            reason: message,
        };
        if (!isProduction) {
            data.metadata = (0, meta_util_1.generateErrorMetadata)(req, { errorName: name, stackTrace: stack || '' });
        }
        // INFO: Implement logger if deployed on an appropriate platform and plan
        console.error(data);
        res.status(data.code).json(data);
        return;
    }
    if (typeof error === 'string') {
        const data = {
            code: httpCode_constant_1.HTTP_500_SERVER_ERROR,
            error: true,
            reason: error,
        };
        if (!isProduction) {
            data.metadata = (0, meta_util_1.generateErrorMetadata)(req);
        }
        // INFO: Implement logger if deployed on an appropriate platform and plan
        console.error(data);
        res.status(data.code).json(data);
        return;
    }
    if (error instanceof error_utils_1.GeneralError) {
        const { code, message: reason, error: isError, name, stack } = error;
        const data = {
            code,
            error: isError,
            reason,
        };
        if (!isProduction) {
            data.metadata = (0, meta_util_1.generateErrorMetadata)(req, { errorName: name, stackTrace: stack || '' });
        }
        // INFO: Implement logger if deployed on an appropriate platform and plan
        isError && console.error(data);
        res.status(data.code).json(data);
        return;
    }
    if (error instanceof Error &&
        'code' in error &&
        error.code === 'EBADCSRFTOKEN' &&
        'statusCode' in error) {
        const { stack, message: reason, name, statusCode } = error;
        const data = {
            code: statusCode,
            error: true,
            reason,
        };
        if (!isProduction) {
            data.metadata = (0, meta_util_1.generateErrorMetadata)(req, { errorName: name, stackTrace: stack !== null && stack !== void 0 ? stack : '' });
        }
        // INFO: Implement logger if deployed on an appropriate platform and plan
        console.error(data);
        res.status(data.code).json(data);
        return;
    }
    if (error instanceof Error) {
        const { stack, message: reason, name } = error;
        const data = {
            code: httpCode_constant_1.HTTP_500_SERVER_ERROR,
            error: true,
            reason,
        };
        if (!isProduction) {
            data.metadata = (0, meta_util_1.generateErrorMetadata)(req, { errorName: name, stackTrace: stack !== null && stack !== void 0 ? stack : '' });
        }
        // INFO: Implement logger if deployed on an appropriate platform and plan
        console.error(data);
        res.status(data.code).json(data);
        return;
    }
    const data = {
        code: httpCode_constant_1.HTTP_500_SERVER_ERROR,
        error: true,
        reason: 'Unknown error',
    };
    if (!isProduction) {
        data.metadata = (0, meta_util_1.generateErrorMetadata)(req);
    }
    // INFO: Implement logger if deployed on an appropriate platform and plan
    console.error(data);
    res.status(data.code).json(data);
    return;
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.middleware.js.map