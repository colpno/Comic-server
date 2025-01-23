"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectId = exports.toMS = void 0;
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = require("mongoose");
const toMS = (duration, unit) => moment_1.default.duration(duration, unit).asMilliseconds();
exports.toMS = toMS;
const toObjectId = (id) => new mongoose_1.Types.ObjectId(id);
exports.toObjectId = toObjectId;
//# sourceMappingURL=converter.util.js.map