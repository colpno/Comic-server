"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChapterContent = exports.getChaptersByComicId = void 0;
const httpCode_constant_1 = require("../../constants/httpCode.constant");
const joi_conf_1 = require("../configs/joi.conf");
const validation_util_1 = require("../utils/validation.util");
const _1 = require("./");
const getChaptersByComicId = (req, res, next) => {
    const allowedIncludes = ['emptyPages', 'futurePublishAt', 'externalUrl'];
    const allowedSort = [
        'createdAt',
        'updatedAt',
        'publishAt',
        'readableAt',
        'volume',
        'chapter',
    ];
    const paramSchema = joi_conf_1.Joi.object({
        id: joi_conf_1.Joi.string().required(),
    });
    const querySchema = joi_conf_1.Joi.object({
        _limit: joi_conf_1.Joi.number().integer().min(1).max(500),
        _page: joi_conf_1.Joi.number().integer().min(1),
        _sort: joi_conf_1.Joi.object().pattern(joi_conf_1.Joi.string().valid(...allowedSort), joi_conf_1.Joi.string().valid('asc', 'desc')),
        include: joi_conf_1.Joi.array().items(joi_conf_1.Joi.string().valid(...allowedIncludes)),
        exclude: joi_conf_1.Joi.array().items(joi_conf_1.Joi.string().valid(...allowedIncludes)),
    });
    const { error: paramError, value: paramValue } = paramSchema.validate(req.params, _1.validationOptions);
    const { error: queryError, value: queryValue } = querySchema.validate(req.query, _1.validationOptions);
    if (paramError || queryError) {
        return res.status(httpCode_constant_1.HTTP_400_BAD_REQUEST).json((0, validation_util_1.processValidationError)(paramError || queryError));
    }
    req.originalParams = req.params;
    req.originalQuery = req.query;
    req.params = paramValue;
    req.query = queryValue;
    next();
};
exports.getChaptersByComicId = getChaptersByComicId;
const getChapterContent = (req, res, next) => {
    const paramSchema = joi_conf_1.Joi.object({
        id: joi_conf_1.Joi.string().required(),
    });
    const { error, value } = paramSchema.validate(req.params, _1.validationOptions);
    if (error) {
        return res.status(httpCode_constant_1.HTTP_400_BAD_REQUEST).json((0, validation_util_1.processValidationError)(error));
    }
    req.originalParams = req.params;
    req.params = value;
    next();
};
exports.getChapterContent = getChapterContent;
//# sourceMappingURL=chapter.validation.js.map