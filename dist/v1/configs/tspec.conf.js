"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_constant_1 = require("../constants/common.constant");
const tspecConfig = {
    specPathGlobs: [`src/${common_constant_1.API_VERSION}/specs/*.ts`],
    openapi: {
        title: 'Comic API',
        description: 'API for comic application. Please visit the api documentation on Github for more information.',
        version: `${common_constant_1.API_VERSION}.0.0`,
    },
};
exports.default = tspecConfig;
//# sourceMappingURL=tspec.conf.js.map