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
Object.defineProperty(exports, "__esModule", { value: true });
const jose_1 = require("jose");
const common_conf_1 = require("../configs/common.conf");
const auth_controller_1 = require("../controllers/auth.controller");
const error_utils_1 = require("../utils/error.utils");
const jwt_util_1 = require("../utils/jwt.util");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authorization = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ');
        if (!authorization) {
            throw new error_utils_1.Error401('Login is required');
        }
        const [authorizationType, accessToken] = authorization;
        if (authorizationType !== 'Bearer') {
            throw new error_utils_1.Error400('Invalid Authorization Type');
        }
        if (!accessToken) {
            throw new error_utils_1.Error401('Login is required');
        }
        const payload = yield (0, jwt_util_1.decryptAndVerifyJWT)(accessToken, common_conf_1.ACCESS_TOKEN_ENCRYPT_SECRET, common_conf_1.ACCESS_TOKEN_SECRET);
        // Is refresh token request and access token is still valid
        if (req.url.includes('refresh-token')) {
            return res.sendStatus(200);
        }
        req.user = payload;
        next();
    }
    catch (error) {
        if (error instanceof jose_1.errors.JWTExpired) {
            (0, auth_controller_1.refreshAccessToken)(req, res, next);
        }
        else {
            next(error);
        }
    }
});
exports.default = isAuthenticated;
//# sourceMappingURL=isAuthenticated.middleware.js.map