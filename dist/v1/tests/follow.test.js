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
const _1 = require("./");
const getEndpoint = (args) => {
    return (0, _1.createEndpoint)(Object.assign(Object.assign({}, args), { baseEndpoint: 'follows' }));
};
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe('Follows', () => {
    let csrfToken, csrfTokenCookie, accessToken, authCookies;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, _1.login)();
        csrfToken = response.csrfToken;
        csrfTokenCookie = response.csrfTokenCookie;
        accessToken = response.accessToken;
        authCookies = [response.refreshTokenCookie];
    }));
    it('should return a list of at most 100 following', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = getEndpoint();
        const response = yield (0, supertest_1.default)(app_1.default).get(url).set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).toBe(200);
    }));
    it('should return 200 for adding to existing', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = getEndpoint();
        const body = {
            follower: '677bc194168fabfa6afc3ed0',
            followingId: 'test',
        };
        const cookies = [...csrfTokenCookie, ...authCookies];
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(url)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', cookies)
            .set('X-CSRF-Token', csrfToken)
            .send(body);
        expect(response.status).toBe(200);
    }));
    // it('should return 201 for initially creating', async () => {
    //   const url = getEndpoint();
    //   const body: AddFollowBody = {
    //     follower: '677bc194168fabfa6afc3ed0',
    //     following: 'test',
    //   };
    //   const cookies = [...csrfTokenCookie, ...authCookies];
    //   const response = await request(app)
    //     .get(url)
    // .set('Authorization', `Bearer ${accessToken}`)
    //     .set('Cookie', cookies)
    //     .set('X-CSRF-Token', csrfToken)
    //     .send(body);
    //   expect(response.status).toBe(200);
    // });
    it('should return 200 for deleting a follow', () => __awaiter(void 0, void 0, void 0, function* () {
        const idToRemove = 'test';
        const url = getEndpoint({ extends: `/${idToRemove}` });
        const cookies = [...csrfTokenCookie, ...authCookies];
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(url)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', cookies)
            .set('X-CSRF-Token', csrfToken);
        expect(response.status).toBe(200);
    }));
});
//# sourceMappingURL=follow.test.js.map