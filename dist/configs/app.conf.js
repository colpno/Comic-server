"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOST_URL = exports.PORT = exports.HOST = void 0;
const dotenv_1 = require("dotenv");
const common_constant_1 = require("../v1/constants/common.constant");
(0, dotenv_1.config)();
exports.HOST = process.env.HOST || 'localhost';
exports.PORT = process.env.PORT || 3000;
exports.HOST_URL = process.env.HOST_URL
    ? `${process.env.HOST_URL}${common_constant_1.BASE_ENDPOINT}`
    : `http://${exports.HOST}:${exports.PORT}${common_constant_1.BASE_ENDPOINT}`;
//# sourceMappingURL=app.conf.js.map