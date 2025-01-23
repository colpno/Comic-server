"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookieConfig = exports.cookieConfig = void 0;
const common_conf_1 = require("./common.conf");
const config = {
    httpOnly: true,
    secure: common_conf_1.APP_ENVIRONMENT === 'production',
    sameSite: common_conf_1.APP_ENVIRONMENT === 'production' ? 'none' : 'lax',
    domain: common_conf_1.APP_ENVIRONMENT === 'production' ? common_conf_1.COOKIE_DOMAIN : undefined,
    // overwrite: true,
    // signed: true,
};
exports.cookieConfig = Object.assign(Object.assign({}, config), { maxAge: 1000 * 60 * 60 * 24 * 7 });
exports.clearCookieConfig = config;
//# sourceMappingURL=cookie.conf.js.map