"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookieCORS = (_req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
};
exports.default = cookieCORS;
//# sourceMappingURL=cookieCORS.middleware.js.map