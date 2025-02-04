"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csurf_1 = __importDefault(require("csurf"));
const express_1 = __importDefault(require("express"));
const cookie_conf_1 = require("./configs/cookie.conf");
const common_constant_1 = require("./constants/common.constant");
const middlewares_1 = require("./middlewares");
const rateLimiter_middleware_1 = __importDefault(require("./middlewares/rateLimiter.middleware"));
const routes_1 = __importDefault(require("./routes"));
const v1App = (0, express_1.default)();
v1App.use(middlewares_1.cors);
v1App.use(middlewares_1.cookieCORS);
v1App.use(middlewares_1.cookieParser);
v1App.use((0, csurf_1.default)({ cookie: cookie_conf_1.cookieConfig }));
v1App.use(middlewares_1.retrieveClientIP);
v1App.use(common_constant_1.BASE_ENDPOINT, routes_1.default, (0, rateLimiter_middleware_1.default)());
v1App.use(middlewares_1.errorHandler);
exports.default = v1App;
//# sourceMappingURL=index.js.map