"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mangadexMangaListSchema = void 0;
const joi_conf_1 = require("../configs/joi.conf");
const allowedTypes = ['manga', 'manhwa', 'manhua'];
const allowedStatuses = ['ongoing', 'completed', 'hiatus', 'cancelled'];
const allowedContentRatings = ['safe', 'suggestive'];
const allowedTagMode = ['AND', 'OR'];
exports.mangadexMangaListSchema = {
    type: joi_conf_1.Joi.string().valid(...allowedTypes),
    title: joi_conf_1.Joi.string(),
    status: joi_conf_1.Joi.array().items(joi_conf_1.Joi.string().valid(...allowedStatuses)),
    year: joi_conf_1.Joi.number().integer().positive().greater(1900).less(2100),
    contentRating: joi_conf_1.Joi.string().valid(...allowedContentRatings),
    createdAt: joi_conf_1.Joi.string().isoDate(),
    updatedAt: joi_conf_1.Joi.string().isoDate(),
    hasAvailableChapters: joi_conf_1.Joi.string().valid('true', 'false'),
    includedTags: joi_conf_1.Joi.array().items(joi_conf_1.Joi.string()),
    includedTagsMode: joi_conf_1.Joi.string().valid(...allowedTagMode),
    ids: joi_conf_1.Joi.array().items(joi_conf_1.Joi.string()).max(100),
    excludedTags: joi_conf_1.Joi.array().items(joi_conf_1.Joi.string()),
    excludedTagsMode: joi_conf_1.Joi.string().valid(...allowedTagMode),
};
//# sourceMappingURL=variables.js.map