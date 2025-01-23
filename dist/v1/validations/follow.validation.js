"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFollow = exports.addFollow = exports.getFollow = exports.getFollowList = void 0;
const httpCode_constant_1 = require("../../constants/httpCode.constant");
const joi_conf_1 = require("../configs/joi.conf");
const validation_util_1 = require("../utils/validation.util");
const _1 = require("./");
const variables_1 = require("./variables");
const getFollowList = (req, res, next) => {
    const comicAllowedSorts = ['addedAt', 'createdAt', 'updatedAt'];
    const allowedComicEmbeds = [
        'author',
        'artist',
        'manga',
        'cover_art',
        'tag',
    ];
    const schema = joi_conf_1.Joi.object({
        _select: joi_conf_1.Joi.string(),
        _embed: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string().valid('following'), joi_conf_1.Joi.object({
            path: joi_conf_1.Joi.string().valid('following').required(),
            match: joi_conf_1.Joi.object(variables_1.mangadexMangaListSchema),
            populate: joi_conf_1.Joi.string().valid(...allowedComicEmbeds),
        })),
        _limit: joi_conf_1.Joi.number().integer().min(1).max(100),
        _page: joi_conf_1.Joi.number().integer().positive(),
        _sort: joi_conf_1.Joi.object().pattern(joi_conf_1.Joi.string().valid(...comicAllowedSorts), joi_conf_1.Joi.string().valid('asc', 'desc')),
        createdAt: joi_conf_1.Joi.string().isoDate(),
        updatedAt: joi_conf_1.Joi.string().isoDate(),
        follower: joi_conf_1.Joi.string(),
        following: joi_conf_1.Joi.string(),
        addedAt: joi_conf_1.Joi.string().isoDate(),
    });
    const { error, value } = schema.validate(req.query, _1.validationOptions);
    if (error) {
        return res.status(httpCode_constant_1.HTTP_400_BAD_REQUEST).json((0, validation_util_1.processValidationError)(error));
    }
    req.originalQuery = req.query;
    req.query = value;
    next();
};
exports.getFollowList = getFollowList;
const getFollow = (req, res, next) => {
    const allowedComicEmbeds = [
        'author',
        'artist',
        'manga',
        'cover_art',
        'tag',
    ];
    const paramSchema = joi_conf_1.Joi.object({
        following: joi_conf_1.Joi.string().required(),
    });
    const querySchema = joi_conf_1.Joi.object({
        _select: joi_conf_1.Joi.string(),
        _embed: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string().valid('following'), joi_conf_1.Joi.object({
            path: joi_conf_1.Joi.string().valid('following').required(),
            match: joi_conf_1.Joi.object(variables_1.mangadexMangaListSchema),
            populate: joi_conf_1.Joi.string().valid(...allowedComicEmbeds),
        })),
        createdAt: joi_conf_1.Joi.string().isoDate(),
        updatedAt: joi_conf_1.Joi.string().isoDate(),
        follower: joi_conf_1.Joi.string(),
        following: joi_conf_1.Joi.string(),
        addedAt: joi_conf_1.Joi.string().isoDate(),
    });
    const { error: queryError, value: queryValue } = querySchema.validate(req.query, _1.validationOptions);
    const { error: paramError, value: paramValue } = paramSchema.validate(req.params, _1.validationOptions);
    if (queryError || paramError) {
        return res.status(httpCode_constant_1.HTTP_400_BAD_REQUEST).json((0, validation_util_1.processValidationError)(queryError || paramError));
    }
    req.originalParams = req.params;
    req.originalQuery = req.query;
    req.query = queryValue;
    req.params = paramValue;
    next();
};
exports.getFollow = getFollow;
const addFollow = (req, res, next) => {
    const schema = joi_conf_1.Joi.object({
        followingId: joi_conf_1.Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, _1.validationOptions);
    if (error) {
        return res.status(httpCode_constant_1.HTTP_400_BAD_REQUEST).json((0, validation_util_1.processValidationError)(error));
    }
    req.originalBody = req.body;
    req.body = value;
    next();
};
exports.addFollow = addFollow;
const removeFollow = (req, res, next) => {
    const schema = joi_conf_1.Joi.object({
        id: joi_conf_1.Joi.string().isMongoObjectId().required(),
    });
    const { error, value } = schema.validate(req.params, _1.validationOptions);
    if (error) {
        return res.status(httpCode_constant_1.HTTP_400_BAD_REQUEST).json((0, validation_util_1.processValidationError)(error));
    }
    req.originalParams = req.params;
    req.params = value;
    next();
};
exports.removeFollow = removeFollow;
//# sourceMappingURL=follow.validation.js.map