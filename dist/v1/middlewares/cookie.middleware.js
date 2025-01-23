"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const common_conf_1 = require("../configs/common.conf");
const middleware = (0, cookie_parser_1.default)(common_conf_1.COOKIE_SECRET);
exports.default = middleware;
//# sourceMappingURL=cookie.middleware.js.map