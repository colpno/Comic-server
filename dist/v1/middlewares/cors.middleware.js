"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const common_conf_1 = require("../configs/common.conf");
const error_utils_1 = require("../utils/error.utils");
const whitelistRegex = common_conf_1.CORS_ORIGINS.split(' ').map((origin) => new RegExp(origin));
const middleware = (0, cors_1.default)({
    origin: function (origin, callback) {
        const isAllowed = whitelistRegex.some((regex) => regex.test(origin)) || !origin;
        if (isAllowed) {
            callback(null, true);
        }
        else {
            callback(new error_utils_1.Error403('Not allowed by CORS'));
        }
    },
    credentials: true,
});
exports.default = middleware;
//# sourceMappingURL=cors.middleware.js.map