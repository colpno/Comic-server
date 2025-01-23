"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeObject = void 0;
const util_1 = __importDefault(require("util"));
/**
 * Reveal hidden properties of an object used in console.log().
 * @example
 * // Result in console:
 * // from
 * { a: [Array] };
 * // to
 * { a: [{ aa: 1, ab: 2 }] };
 */
const serializeObject = (obj, opts) => {
    return util_1.default.inspect(obj, Object.assign({ showHidden: false, depth: null, colors: true }, opts));
};
exports.serializeObject = serializeObject;
//# sourceMappingURL=console.util.js.map