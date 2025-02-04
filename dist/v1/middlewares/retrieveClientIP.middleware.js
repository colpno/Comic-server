"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_ip_1 = __importDefault(require("request-ip"));
const retrieveClientIP = function (req, _res, next) {
    const clientIp = request_ip_1.default.getClientIp(req);
    req.clientIP = clientIp;
    next();
};
exports.default = retrieveClientIP;
//# sourceMappingURL=retrieveClientIP.middleware.js.map