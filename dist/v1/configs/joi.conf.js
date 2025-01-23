"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joi = void 0;
const joi_1 = __importDefault(require("joi"));
const lodash_1 = require("lodash");
const mongoose_1 = require("mongoose");
const escapeHTML = {
    type: 'string',
    base: joi_1.default.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must be a string',
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                if (typeof value !== 'string') {
                    return helpers.error('string.escapeHTML');
                }
                return (0, lodash_1.escape)(value);
            },
        },
    },
};
const isMongoObjectId = {
    type: 'string',
    base: joi_1.default.string(),
    messages: {
        'string.isMongoObjectId': '{{#label}} must be a mongo object id',
    },
    rules: {
        isMongoObjectId: {
            validate(value, helpers) {
                if (!(0, mongoose_1.isObjectIdOrHexString)(value)) {
                    return helpers.error('string.isMongoObjectId');
                }
                return value;
            },
        },
    },
};
const maxDepth = {
    type: 'object',
    base: joi_1.default.object(),
    messages: {
        'object.maxDepth': '{{#label}} depth should not exceed {{#depth}} levels',
    },
    rules: {
        maxDepth: {
            method(depth) {
                return this.$_addRule({ name: 'maxDepth', args: { depth } });
            },
            args: [
                {
                    name: 'depth',
                    ref: true,
                    assert: (value) => typeof value === 'number' && !isNaN(value),
                    message: 'must be a number',
                },
            ],
            validate(value, helpers, args) {
                const calculateDepth = (obj, currentDepth = 0) => {
                    if (typeof obj !== 'object' || obj === null) {
                        return currentDepth;
                    }
                    const depths = Object.values(obj).map((val) => calculateDepth(val, currentDepth + 1));
                    return Math.max(currentDepth, ...depths);
                };
                const objectDepth = calculateDepth(value);
                if (objectDepth > args.depth) {
                    return helpers.error('object.maxDepth', { depth: args.depth });
                }
                return value;
            },
        },
    },
};
exports.Joi = joi_1.default.extend(escapeHTML, isMongoObjectId, maxDepth);
//# sourceMappingURL=joi.conf.js.map