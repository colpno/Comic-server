"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOffset = exports.toMangaDexEmbedValue = void 0;
const toMangaDexEmbedValue = (embed) => {
    if (!embed)
        return undefined;
    return Array.isArray(embed) ? embed : [embed];
};
exports.toMangaDexEmbedValue = toMangaDexEmbedValue;
const calculateOffset = (limit, page) => {
    return limit && page ? (page - 1) * limit : undefined;
};
exports.calculateOffset = calculateOffset;
//# sourceMappingURL=mangadex.util.js.map