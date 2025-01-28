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
exports.refreshAccessToken = exports.resetPassword = exports.register = exports.logout = exports.login = exports.generateCSRFToken = void 0;
const jose_1 = require("jose");
const httpCode_constant_1 = require("../../constants/httpCode.constant");
const common_conf_1 = require("../configs/common.conf");
const cookie_conf_1 = require("../configs/cookie.conf");
const user_service_1 = require("../services/user.service");
const converter_util_1 = require("../utils/converter.util");
const crypto_util_1 = require("../utils/crypto.util");
const error_utils_1 = require("../utils/error.utils");
const jwt_util_1 = require("../utils/jwt.util");
const _15MINS = '15m';
const _1DAY = '1d';
const createAccessToken = (payload) => {
    return (0, jwt_util_1.signAndEncryptJWT)(payload, common_conf_1.ACCESS_TOKEN_SECRET, common_conf_1.ACCESS_TOKEN_ENCRYPT_SECRET, {
        expiresIn: _15MINS,
    });
};
const createRefreshToken = (payload, rememberMe) => {
    return (0, jwt_util_1.signAndEncryptJWT)(payload, common_conf_1.REFRESH_TOKEN_SECRET, common_conf_1.REFRESH_TOKEN_ENCRYPT_SECRET, {
        expiresIn: rememberMe ? _1DAY : '50y',
    });
};
const generateCSRFToken = (req, res, next) => {
    try {
        return res.json({ data: req.csrfToken() });
    }
    catch (error) {
        next(error);
    }
};
exports.generateCSRFToken = generateCSRFToken;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, rememberMe } = req.body;
        // Check if the user is already registered
        const user = yield (0, user_service_1.getUser)({ username });
        if (!user) {
            throw new error_utils_1.Error400(`${username} is not registered`);
        }
        // Compare passwords
        const hashedPassword = (0, crypto_util_1.hashString)(password, user.password.salt).hashedValue;
        if (user.password.hashed !== hashedPassword) {
            throw new error_utils_1.Error400('Password is incorrect');
        }
        // Create tokens
        const jwtPayload = {
            userId: user.id,
        };
        const accessToken = yield createAccessToken(jwtPayload);
        let refreshToken = user.refreshToken;
        // Create a new refresh token if there is no refresh token
        if (!refreshToken) {
            refreshToken = yield createRefreshToken(jwtPayload, rememberMe);
        }
        else {
            // User has a refresh token
            try {
                // Try to verify the refresh token
                yield (0, jwt_util_1.decryptAndVerifyJWT)(refreshToken, common_conf_1.REFRESH_TOKEN_ENCRYPT_SECRET, common_conf_1.REFRESH_TOKEN_SECRET);
            }
            catch (error) {
                // Refresh token is expired, create a new one
                if (error instanceof jose_1.errors.JWTExpired) {
                    refreshToken = yield createRefreshToken(jwtPayload, rememberMe);
                }
                else {
                    // Other token errors
                    next(error);
                }
            }
        }
        // Update the refresh token
        if (refreshToken !== user.refreshToken) {
            yield (0, user_service_1.updateUser)({ _id: user.id }, { refreshToken });
        }
        res.cookie(common_conf_1.COOKIE_NAME_REFRESH_TOKEN, refreshToken, cookie_conf_1.cookieConfig);
        return res.json({
            data: {
                accessToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[common_conf_1.COOKIE_NAME_REFRESH_TOKEN];
    const clearCookies = () => {
        res.clearCookie(common_conf_1.COOKIE_NAME_REFRESH_TOKEN, cookie_conf_1.clearCookieConfig);
    };
    try {
        // Check the existence of the refresh token
        if (!refreshToken) {
            return res.sendStatus(httpCode_constant_1.HTTP_204_NO_CONTENT);
        }
        clearCookies();
        return res.sendStatus(httpCode_constant_1.HTTP_204_NO_CONTENT);
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Check if the user already exists
        const existingUser = yield (0, user_service_1.getUser)({ username });
        if (existingUser) {
            throw new error_utils_1.Error400('Email already exists');
        }
        // Hash the password
        const salt = (0, crypto_util_1.generateSalt)();
        const hashedPassword = (0, crypto_util_1.hashString)(password, salt).hashedValue;
        // Create the new user
        const newUser = {
            username,
            email,
            password: {
                hashed: hashedPassword,
                salt,
            },
        };
        yield (0, user_service_1.createUser)(newUser);
        return res.sendStatus(httpCode_constant_1.HTTP_204_NO_CONTENT);
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, passwordVerification } = req.body;
        const { userId } = req.user;
        // Check the existence of the user
        const existingUser = yield (0, user_service_1.getUser)(email ? { email } : { _id: (0, converter_util_1.toObjectId)(userId) });
        if (!existingUser) {
            throw new error_utils_1.Error400('No user that has the email');
        }
        // Compare passwords
        if (password !== passwordVerification) {
            throw new error_utils_1.Error400('Password and password verification do not match');
        }
        // Hash the password
        const salt = (0, crypto_util_1.generateSalt)();
        const hashedPassword = (0, crypto_util_1.hashString)(password, salt).hashedValue;
        // Update the user
        const neededUpdate = {
            password: {
                hashed: hashedPassword,
                salt,
            },
        };
        const result = yield (0, user_service_1.updateUser)({ _id: (0, converter_util_1.toObjectId)(userId) }, neededUpdate);
        // No user is updated
        if (!result) {
            throw new error_utils_1.Error400('Failed to update the password');
        }
        return res.sendStatus(httpCode_constant_1.HTTP_204_NO_CONTENT);
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[common_conf_1.COOKIE_NAME_REFRESH_TOKEN];
        // No refresh token in the cookie
        if (!refreshToken) {
            throw new error_utils_1.Error403();
        }
        let payload;
        try {
            // Verify the refresh token
            payload = yield (0, jwt_util_1.decryptAndVerifyJWT)(refreshToken, common_conf_1.REFRESH_TOKEN_ENCRYPT_SECRET, common_conf_1.REFRESH_TOKEN_SECRET);
        }
        catch (error) {
            // Refresh token is expired
            if (error instanceof jose_1.errors.JWTExpired) {
                throw new error_utils_1.Error401('Login is required');
            }
            else {
                next(error);
            }
        }
        // Create a new access token
        const newPayload = {
            userId: payload.userId,
        };
        const accessToken = yield createAccessToken(newPayload);
        return res.json({
            data: {
                accessToken: accessToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshAccessToken = refreshAccessToken;
//# sourceMappingURL=auth.controller.js.map