"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadingChapter = exports.getComicByTitle = exports.getComicList = void 0;
const httpCode_constant_1 = require("../../constants/httpCode.constant");
const joi_conf_1 = require("../configs/joi.conf");
const validation_util_1 = require("../utils/validation.util");
const _1 = require("./");
const variables_1 = require("./variables");
const getComicList = (req, res, next) => {
    const { _select, _embed, _sort } = validation_util_1.validateGetRequest, commands = __rest(validation_util_1.validateGetRequest, ["_select", "_embed", "_sort"]);
    const allowedEmbeds = [
        'author',
        'artist',
        'manga',
        'cover_art',
        'tag',
    ];
    const allowedSorts = [
        'title',
        'year',
        'createdAt',
        'updatedAt',
        'latestUploadedChapter',
        'followedCount',
        'relevance',
        'rating',
    ];
    const schema = joi_conf_1.Joi.object(Object.assign(Object.assign(Object.assign({}, commands), { _sort: joi_conf_1.Joi.object().pattern(joi_conf_1.Joi.string().valid(...allowedSorts), joi_conf_1.Joi.string().valid('asc', 'desc')), _embed: joi_conf_1.Joi.alternatives().try(joi_conf_1.Joi.string().valid(...allowedEmbeds), joi_conf_1.Joi.array().items(joi_conf_1.Joi.string().valid(...allowedEmbeds))), _limit: joi_conf_1.Joi.number().integer().positive().max(100), _page: joi_conf_1.Joi.number().integer().positive() }), variables_1.mangadexMangaListSchema));
    const { error, value } = schema.validate(req.query, _1.validationOptions);
    if (error) {
        return res.status(httpCode_constant_1.HTTP_400_BAD_REQUEST).json((0, validation_util_1.processValidationError)(error));
    }
    req.originalQuery = req.query;
    req.query = value;
    next();
};
exports.getComicList = getComicList;
const getComicByTitle = (req, res, next) => {
    const allowedEmbeds = [
        'author',
        'artist',
        'manga',
        'cover_art',
        'tag',
    ];
    const paramSchema = joi_conf_1.Joi.object({
        title: joi_conf_1.Joi.string().required(),
    });
    const querySchema = joi_conf_1.Joi.object({
        _embed: joi_conf_1.Joi.array().items(joi_conf_1.Joi.string().valid(...allowedEmbeds)),
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
exports.getComicByTitle = getComicByTitle;
const getReadingChapter = (req, res, next) => {
    const paramSchema = joi_conf_1.Joi.object({
        chapter: joi_conf_1.Joi.string().required(),
        title: joi_conf_1.Joi.string().required(),
    });
    const { error: paramError, value: paramValue } = paramSchema.validate(req.params, _1.validationOptions);
    if (paramError) {
        return res.status(httpCode_constant_1.HTTP_400_BAD_REQUEST).json((0, validation_util_1.processValidationError)(paramError));
    }
    req.originalParams = req.params;
    req.params = paramValue;
    next();
};
exports.getReadingChapter = getReadingChapter;
//# sourceMappingURL=comic.validation.js.map