"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_NAME_REFRESH_TOKEN = exports.COOKIE_NAME_ACCESS_TOKEN = exports.COOKIE_NAME_CSRF_TOKEN = exports.COOKIE_DOMAIN = exports.REFRESH_TOKEN_ENCRYPT_SECRET = exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_ENCRYPT_SECRET = exports.ACCESS_TOKEN_SECRET = exports.COOKIE_SECRET = exports.CSRF_SECRET = exports.CORS_ORIGINS = exports.APP_ENVIRONMENT = void 0;
const dotenv_1 = require("dotenv");
const error_utils_1 = require("../utils/error.utils");
(0, dotenv_1.config)();
exports.APP_ENVIRONMENT = process.env.NODE_ENV || 'production';
/** Separate multiple origins with a space. */
exports.CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173';
if (!process.env.CSRF_SECRET) {
    throw new error_utils_1.Error500('CSRF_SECRET is not provided');
}
if (!process.env.COOKIE_SECRET) {
    throw new error_utils_1.Error500('COOKIE_SECRET is not provided');
}
if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new error_utils_1.Error500('ACCESS_TOKEN_SECRET is not provided');
}
if (!process.env.ACCESS_TOKEN_ENCRYPT_SECRET) {
    throw new error_utils_1.Error500('ACCESS_TOKEN_SECRET is not provided');
}
if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new error_utils_1.Error500('REFRESH_TOKEN_SECRET is not provided');
}
if (!process.env.REFRESH_TOKEN_ENCRYPT_SECRET) {
    throw new error_utils_1.Error500('REFRESH_TOKEN_SECRET is not provided');
}
exports.CSRF_SECRET = process.env.CSRF_SECRET;
exports.COOKIE_SECRET = process.env.COOKIE_SECRET;
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.ACCESS_TOKEN_ENCRYPT_SECRET = process.env.ACCESS_TOKEN_ENCRYPT_SECRET;
exports.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
exports.REFRESH_TOKEN_ENCRYPT_SECRET = process.env.REFRESH_TOKEN_ENCRYPT_SECRET;
if (exports.APP_ENVIRONMENT === 'production') {
    if (!process.env.COOKIE_DOMAIN) {
        throw new error_utils_1.Error500('COOKIE_DOMAIN is not provided');
    }
}
exports.COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
exports.COOKIE_NAME_CSRF_TOKEN = exports.APP_ENVIRONMENT === 'production' ? '__Secure-psifi.csrf-token' : 'csrf-token';
exports.COOKIE_NAME_ACCESS_TOKEN = exports.APP_ENVIRONMENT === 'production' ? '__Secure-access-token' : 'access-token';
exports.COOKIE_NAME_REFRESH_TOKEN = exports.APP_ENVIRONMENT === 'production' ? '__Secure-refresh-token' : 'refresh-token';
//# sourceMappingURL=common.conf.js.map