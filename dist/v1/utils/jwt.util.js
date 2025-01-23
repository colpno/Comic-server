"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.signJWT = signJWT;
exports.encryptJWT = encryptJWT;
exports.decryptJWT = decryptJWT;
exports.verifyJWT = verifyJWT;
exports.signAndEncryptJWT = signAndEncryptJWT;
exports.decryptAndVerifyJWT = decryptAndVerifyJWT;
const jose = __importStar(require("jose"));
// Function to generate a 256-bit key
function generateKey(secret) {
    return __awaiter(this, void 0, void 0, function* () {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const hash = yield crypto.subtle.digest('SHA-256', keyData);
        return new Uint8Array(hash);
    });
}
// Function to sign a JWT
function signJWT(payload, secret, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretKey = yield generateKey(secret);
        return new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime((options === null || options === void 0 ? void 0 : options.expiresIn) || '15m')
            .sign(secretKey);
    });
}
// Function to encrypt a JWT
function encryptJWT(payload, secret, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretKey = yield generateKey(secret);
        return new jose.EncryptJWT(payload)
            .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
            .setIssuedAt()
            .setExpirationTime((options === null || options === void 0 ? void 0 : options.expiresIn) || '15m')
            .encrypt(secretKey);
    });
}
// Function to decrypt a JWT
function decryptJWT(token, secret) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretKey = yield generateKey(secret);
        const { payload } = yield jose.jwtDecrypt(token, secretKey);
        return payload;
    });
}
// Function to verify a JWT
function verifyJWT(token, secret) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretKey = yield generateKey(secret);
        const { payload } = yield jose.jwtVerify(token, secretKey);
        return payload;
    });
}
// Function to sign and then encrypt a JWT
function signAndEncryptJWT(payload, signSecret, encryptSecret, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const signedJWT = yield signJWT(payload, signSecret, options);
        const encryptedJWT = yield encryptJWT({ jwt: signedJWT }, encryptSecret, options);
        return encryptedJWT;
    });
}
// Function to decrypt and then verify a JWT
function decryptAndVerifyJWT(token, decryptSecret, verifySecret) {
    return __awaiter(this, void 0, void 0, function* () {
        const decryptedPayload = yield decryptJWT(token, decryptSecret);
        const signedJWT = decryptedPayload.jwt;
        const verifiedPayload = yield verifyJWT(signedJWT, verifySecret);
        return verifiedPayload;
    });
}
//# sourceMappingURL=jwt.util.js.map