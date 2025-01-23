"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const common_conf_1 = require("../configs/common.conf");
const middleware = (0, cors_1.default)({
    origin: common_conf_1.CORS_ORIGINS.split(' '),
    credentials: true,
});
exports.default = middleware;
//# sourceMappingURL=cors.middleware.js.map