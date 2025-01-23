"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// api.mandagadex.org limits to 5 requests per second
// https://api.mangadex.org/docs/2-limitations/#general-rate-limit
const rateLimiter = (options) => {
    var _a, _b;
    return (0, express_rate_limit_1.default)(Object.assign(Object.assign({}, options), { windowMs: (_a = options === null || options === void 0 ? void 0 : options.windowMs) !== null && _a !== void 0 ? _a : 1000, limit: (_b = options === null || options === void 0 ? void 0 : options.limit) !== null && _b !== void 0 ? _b : 4 }));
};
exports.default = rateLimiter;
//# sourceMappingURL=rateLimiter.middleware.js.map