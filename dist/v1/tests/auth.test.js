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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const common_conf_1 = require("../configs/common.conf");
const _1 = require("./");
const getEndpoint = (args) => {
    return (0, _1.createEndpoint)(Object.assign(Object.assign({}, args), { baseEndpoint: 'auth' }));
};
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe('Auth', () => {
    let csrfToken = undefined;
    let csrfTokenCookie = undefined;
    let accessToken = undefined;
    let refreshToken = undefined;
    it('should return a csrf token in both cookie and body', () => __awaiter(void 0, void 0, void 0, function* () {
        const endpoint = getEndpoint({ extends: '/csrf-token' });
        const response = yield (0, supertest_1.default)(app_1.default).get(endpoint);
        const { data: responseCsrfToken } = response.body;
        const cookies = response.headers['set-cookie'];
        const csrfCookie = cookies === null || cookies === void 0 ? void 0 : cookies.find((cookie) => cookie.includes(common_conf_1.COOKIE_NAME_CSRF_TOKEN));
        const isProperlySetCsrfCookie = csrfCookie && csrfCookie.includes('HttpOnly') && csrfCookie.includes('Max-Age');
        expect(response.status).toBe(200);
        expect(responseCsrfToken).toBeDefined();
        expect(csrfCookie).toBeDefined();
        expect(isProperlySetCsrfCookie).toBe(true);
        csrfToken = responseCsrfToken;
        csrfTokenCookie = cookies;
    }));
    describe('Login', () => {
        it('should return 403 when accessing /login without a csrf token', () => __awaiter(void 0, void 0, void 0, function* () {
            const endpoint = getEndpoint({ extends: '/login' });
            const response = yield (0, supertest_1.default)(app_1.default).post(endpoint);
            expect(response.status).toBe(403);
        }));
        it('Should return 400 when accessing /login with invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(csrfToken && csrfTokenCookie)) {
                throw new Error('csrfToken and cookie are not set');
            }
            const endpoint = getEndpoint({ extends: '/login' });
            const credential = {
                email: 'john@gmail.com',
                password: 'johnajsodiasjdaisodjas',
                rememberMe: false,
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Cookie', csrfTokenCookie)
                .set('X-CSRF-Token', csrfToken)
                .send(credential);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('reason');
            expect(/password/i.test(response.body.reason)).toBe(true);
        }));
        it('should return access token and refresh token after logging in', () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(csrfToken && csrfTokenCookie)) {
                throw new Error('csrfToken and cookie are not set');
            }
            const endpoint = getEndpoint({ extends: '/login' });
            const credential = {
                email: 'john@gmail.com',
                password: 'johnjohnjohnjohnjohn',
                rememberMe: false,
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Cookie', csrfTokenCookie)
                .set('X-CSRF-Token', csrfToken)
                .send(credential);
            const { data: responseAccessToken } = response.body;
            const cookies = response.headers['set-cookie'];
            const refreshTokenCookie = cookies === null || cookies === void 0 ? void 0 : cookies.find((cookie) => cookie.includes(common_conf_1.COOKIE_NAME_REFRESH_TOKEN));
            const isProperlySetRefreshTokenCookie = refreshTokenCookie &&
                refreshTokenCookie.includes('HttpOnly') &&
                refreshTokenCookie.includes('Max-Age');
            expect(response.status).toBe(200);
            expect(responseAccessToken).toBeDefined();
            expect(refreshTokenCookie).toBeDefined();
            expect(isProperlySetRefreshTokenCookie).toBe(true);
            accessToken = responseAccessToken;
            refreshToken = refreshTokenCookie;
        }));
    });
    describe('Register', () => {
        it('should return 403 when accessing /register without a csrf token', () => __awaiter(void 0, void 0, void 0, function* () {
            const endpoint = getEndpoint({ extends: '/register' });
            const response = yield (0, supertest_1.default)(app_1.default).post(endpoint);
            expect(response.status).toBe(403);
        }));
        it('Should return 400 when accessing /register with invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(csrfToken && csrfTokenCookie)) {
                throw new Error('csrfToken and cookie are not set');
            }
            const endpoint = getEndpoint({ extends: '/register' });
            const credential = {
                email: 'john@gmail.com',
                password: 'johnajsodiasjdaisodjas',
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post(endpoint)
                .set('Cookie', csrfTokenCookie)
                .set('X-CSRF-Token', csrfToken)
                .send(credential);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('reason');
            expect(/password/i.test(response.body.reason)).toBe(true);
        }));
    });
    describe('Refresh Token', () => {
        it('should return 403 when refreshing access token without refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
            const endpoint = getEndpoint({ extends: '/refresh-token' });
            const response = yield (0, supertest_1.default)(app_1.default).get(endpoint);
            expect(response.status).toBe(403);
        }));
        it('should return 403 when refreshing access token with invalid refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
            const endpoint = getEndpoint({ extends: '/refresh-token' });
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Cookie', `${common_conf_1.COOKIE_NAME_REFRESH_TOKEN}=invalid_refresh_token`);
            expect(response.status).toBe(403);
        }));
        it('should return new access token with a valid refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
            if (!refreshToken) {
                throw new Error('refreshToken is not set');
            }
            const endpoint = getEndpoint({ extends: '/refresh-token' });
            const response = yield (0, supertest_1.default)(app_1.default).get(endpoint).set('Cookie', refreshToken);
            const { data: newAccessToken } = response.body;
            expect(response.status).toBe(200);
            expect(newAccessToken).toBeDefined();
        }));
    });
    describe('Logout', () => {
        it('should return 401 when accessing /logout without authorization', () => __awaiter(void 0, void 0, void 0, function* () {
            const endpoint = getEndpoint({ extends: '/logout' });
            const response = yield (0, supertest_1.default)(app_1.default).get(endpoint);
            expect(response.status).toBe(401);
        }));
        it('should logout successfully when already authorizing', () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(accessToken && refreshToken)) {
                throw new Error('accessToken and refreshToken are not set');
            }
            const endpoint = getEndpoint({ extends: '/logout' });
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(endpoint)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', refreshToken);
            expect(response.status).toBe(204);
        }));
    });
});
//# sourceMappingURL=auth.test.js.map