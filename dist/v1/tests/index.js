"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createEndpoint = exports.stringifyQuery = void 0;
const qs_1 = __importDefault(require("qs"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const common_conf_1 = require("../configs/common.conf");
const common_constant_1 = require("../constants/common.constant");
const console_util_1 = require("../utils/console.util");
const error_utils_1 = require("../utils/error.utils");
const stringifyQuery = (obj) => qs_1.default.stringify(obj);
exports.stringifyQuery = stringifyQuery;
const createEndpoint = (args) => {
    const queryStr = (args === null || args === void 0 ? void 0 : args.query) ? `?${(0, exports.stringifyQuery)(args.query)}` : '';
    const extension = (args === null || args === void 0 ? void 0 : args.extends) || '';
    const baseEndpoint = (args === null || args === void 0 ? void 0 : args.baseEndpoint) || '';
    return `${common_constant_1.BASE_ENDPOINT}/${baseEndpoint}${extension}${queryStr}`;
};
exports.createEndpoint = createEndpoint;
const defaultCredentials = {
    email: 'john@gmail.com',
    password: '12345678901234567',
};
const login = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (credentials = defaultCredentials) {
    var _a;
    try {
        //  Retrieve CSRF token
        const getCsrfRoute = `${common_constant_1.BASE_ENDPOINT}/auth/csrf-token`;
        const getCsrfResponse = yield (0, supertest_1.default)(app_1.default).get(getCsrfRoute);
        const { data: csrfToken } = getCsrfResponse.body;
        const csrfTokenCookie = getCsrfResponse.headers['set-cookie'];
        if (!csrfToken) {
            throw new error_utils_1.Error500('No CSRF token is returned in body');
        }
        if (!csrfTokenCookie) {
            throw new error_utils_1.Error500('No CSRF token is set in cookie');
        }
        // Login
        const loginRoute = `${common_constant_1.BASE_ENDPOINT}/auth/login`;
        const loginResponse = yield (0, supertest_1.default)(app_1.default)
            .post(loginRoute)
            .set('Cookie', csrfTokenCookie)
            .set('X-CSRF-Token', csrfToken)
            .send(credentials);
        const accessToken = (_a = loginResponse.body.data) === null || _a === void 0 ? void 0 : _a.accessToken;
        const cookies = loginResponse.headers['set-cookie'];
        const refreshTokenCookie = cookies === null || cookies === void 0 ? void 0 : cookies.find((cookie) => cookie.includes(common_conf_1.COOKIE_NAME_REFRESH_TOKEN));
        if (!accessToken) {
            throw new error_utils_1.Error500('No access token is set in cookie');
        }
        if (!refreshTokenCookie) {
            throw new error_utils_1.Error500('No refresh token is set in cookie');
        }
        return {
            csrfToken,
            csrfTokenCookie,
            accessToken,
            refreshTokenCookie,
        };
    }
    catch (error) {
        console.error((0, console_util_1.serializeObject)(error));
        throw error;
    }
});
exports.login = login;
//# sourceMappingURL=index.js.map