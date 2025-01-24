"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error - This is a workaround for the lack of type definitions for the cors-anywhere package.
const cors_anywhere_1 = require("cors-anywhere");
const corsProxy = (0, cors_anywhere_1.createServer)({
    originWhitelist: [], // Allow all origins
    requireHeaders: [], // Do not require any headers.
    removeHeaders: ['cookie', 'cookie2', 'referer'], // Do not remove any headers.
});
exports.default = corsProxy;
//# sourceMappingURL=corsProxy.service.js.map