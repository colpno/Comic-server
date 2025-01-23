"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashString = exports.generateSalt = exports.generateCSRFToken = void 0;
const crypto_1 = require("crypto");
const generateCSRFToken = () => {
    return (0, crypto_1.randomBytes)(20).toString('hex');
};
exports.generateCSRFToken = generateCSRFToken;
const generateSalt = (length = 16) => {
    return (0, crypto_1.randomBytes)(length).toString('hex');
};
exports.generateSalt = generateSalt;
const hashString = (plainText, salt, algorithm = 'sha256') => {
    const hash = (0, crypto_1.createHash)(algorithm);
    hash.update(plainText + salt);
    const hashedValue = hash.digest('hex');
    return { salt, hashedValue };
};
exports.hashString = hashString;
//# sourceMappingURL=crypto.util.js.map