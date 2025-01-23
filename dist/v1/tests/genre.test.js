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
    return (0, _1.createEndpoint)(Object.assign(Object.assign({}, args), { baseEndpoint: 'genres' }));
};
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe('Genre', () => {
    it('should return a list of genres', () => __awaiter(void 0, void 0, void 0, function* () {
        const url = getEndpoint();
        const response = yield (0, supertest_1.default)(app_1.default).get(url);
        const data = response.body.data;
        expect(response.status).toBe(200);
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
    }));
});
//# sourceMappingURL=genre.test.js.map