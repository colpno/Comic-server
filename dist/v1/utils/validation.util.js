"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayMinLength = exports.validateGetRequest = exports.embedSchema = exports.clientProvidedMongoOperatorsSchema = exports.logicalOperatorsSchema = exports.normalOperatorsSchema = exports.processValidationError = void 0;
const httpCode_constant_1 = require("../../constants/httpCode.constant");
const joi_conf_1 = require("../configs/joi.conf");
/*
=====================================================
            Request input validation
=====================================================
*/
const processValidationError = (error) => {
    const content = {
        reason: error.details.map((detail) => ({
            path: detail.path.join('.'),
            message: detail.message,
        })),
        code: httpCode_constant_1.HTTP_400_BAD_REQUEST,
        error: true,
    };
    return content;
};
exports.processValidationError = processValidationError;
exports.normalOperatorsSchema = {
    like: joi_conf_1.Joi.string(),
    eq: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), joi_conf_1.Joi.number(), joi_conf_1.Joi.boolean()),
    ne: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), joi_conf_1.Joi.number(), joi_conf_1.Joi.boolean()),
    exists: joi_conf_1.Joi.boolean(),
    gt: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), joi_conf_1.Joi.number()),
    gte: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), joi_conf_1.Joi.number()),
    lt: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), joi_conf_1.Joi.number()),
    lte: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), joi_conf_1.Joi.number()),
    size: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.number(), joi_conf_1.Joi.object({
        ne: joi_conf_1.Joi.number(),
        gte: joi_conf_1.Joi.number(),
        gt: joi_conf_1.Joi.number(),
        lte: joi_conf_1.Joi.number(),
        lt: joi_conf_1.Joi.number(),
    })),
    all: joi_conf_1.Joi.array().items(joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), joi_conf_1.Joi.number())),
    in: joi_conf_1.Joi.array().items(joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), joi_conf_1.Joi.number())),
    nin: joi_conf_1.Joi.array().items(joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), joi_conf_1.Joi.number())),
};
exports.logicalOperatorsSchema = {
    or: joi_conf_1.Joi.array().items(joi_conf_1.Joi.object().pattern(/.*/, joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), exports.normalOperatorsSchema))),
    and: joi_conf_1.Joi.array().items(joi_conf_1.Joi.object().pattern(/.*/, joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), exports.normalOperatorsSchema))),
};
exports.clientProvidedMongoOperatorsSchema = joi_conf_1.Joi.object(exports.normalOperatorsSchema).keys(exports.logicalOperatorsSchema);
exports.embedSchema = joi_conf_1.Joi.object({
    path: joi_conf_1.Joi.string().required(),
    select: joi_conf_1.Joi.string(),
    match: joi_conf_1.Joi.object().pattern(/.*/, joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), exports.clientProvidedMongoOperatorsSchema)),
    populate: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), joi_conf_1.Joi.link('#embed'), joi_conf_1.Joi.array().items(joi_conf_1.Joi.link('#embed'))),
})
    .id('embed')
    .maxDepth(3);
exports.validateGetRequest = {
    _limit: joi_conf_1.Joi.number().integer().positive(),
    _page: joi_conf_1.Joi.number().integer().positive().greater(0),
    _sort: joi_conf_1.Joi.object().pattern(/.*/, joi_conf_1.Joi.string().valid('asc', 'desc')),
    _select: joi_conf_1.Joi.string(),
    _embed: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string(), exports.embedSchema, joi_conf_1.Joi.array().items(exports.embedSchema)),
};
/*
=====================================================
                  Mongoose Schema
=====================================================
*/
const arrayMinLength = (limit) => (value) => value.length >= limit;
exports.arrayMinLength = arrayMinLength;
//# sourceMappingURL=validation.util.js.map