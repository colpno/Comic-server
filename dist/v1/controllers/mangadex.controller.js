"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChapterContent = exports.getChaptersByMangaId = exports.getMangaByTitle = exports.getMangaList = exports.getTagIdList = exports.getTagList = void 0;
const axios_1 = __importDefault(require("axios"));
const mangadex_service_1 = require("../services/mangadex.service");
const BASE_URL = 'https://api.mangadex.org';
const MANGA_URL = `${BASE_URL}/manga`;
const TAG_URL = `${MANGA_URL}/tag`;
const getMangaChaptersUrl = (mangaId) => `${BASE_URL}/manga/${mangaId}/feed`;
const getChapterImagesUrl = (chapterId) => `${BASE_URL}/at-home/server/${chapterId}`;
const getTagList = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, axios_1.default)(TAG_URL);
        return res.data.data;
    }
    catch (error) {
        throw error;
    }
});
exports.getTagList = getTagList;
const getTagIdList = (tagNames) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield (0, axios_1.default)(TAG_URL);
        const tagIds = tags.data.data
            .filter((tag) => tagNames
            .map((tagName) => tagName.toLowerCase())
            .includes(tag.attributes.name.en.toLowerCase()))
            .map((tag) => tag.id);
        return tagIds;
    }
    catch (error) {
        throw error;
    }
});
exports.getTagIdList = getTagIdList;
const getMangaList = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(MANGA_URL, {
            params: Object.assign({ contentRating: ['safe', 'suggestive'], availableTranslatedLanguage: ['en'] }, query),
        });
        const { data } = response;
        let manga = data.data.map((manga) => (0, mangadex_service_1.mangadexToComic)(manga));
        const meta = {
            page: data.offset / data.limit + 1,
            limit: data.limit,
            totalItems: data.total,
            totalPages: Math.ceil(data.total / data.limit),
        };
        return {
            data: manga,
            meta,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getMangaList = getMangaList;
const getMangaByTitle = (titleQuery, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const title = titleQuery.replace(/-/g, ' ');
        const response = yield axios_1.default.get(MANGA_URL, {
            params: Object.assign(Object.assign({ contentRating: ['safe', 'suggestive'], availableTranslatedLanguage: ['en'] }, query), { title }),
        });
        // Find the manga with the exact title
        const manga = response.data.data.find((manga) => manga.attributes.title.en.toLowerCase() === title.toLowerCase());
        if (!manga)
            return null;
        const comic = (0, mangadex_service_1.mangadexToComic)(manga);
        return comic;
    }
    catch (error) {
        throw error;
    }
});
exports.getMangaByTitle = getMangaByTitle;
const getChaptersByMangaId = (mangaId, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, offset, order, include: includes, exclude: excludes } = query || {};
        const url = getMangaChaptersUrl(mangaId);
        const includeParam = includes === null || includes === void 0 ? void 0 : includes.reduce((acc, include) => {
            acc[`include${include[0].toUpperCase()}${include.slice(1)}`] = 1;
            return acc;
        }, {});
        const excludeParam = excludes === null || excludes === void 0 ? void 0 : excludes.reduce((acc, exclude) => {
            acc[`exclude${exclude[0].toUpperCase()}${exclude.slice(1)}`] = 0;
            return acc;
        }, {});
        const params = Object.assign(Object.assign(Object.assign({}, includeParam), excludeParam), { contentRating: ['safe', 'suggestive'], translatedLanguage: ['en'], limit,
            offset,
            order });
        const response = yield axios_1.default.get(url, {
            params,
        });
        const _a = response.data, { data } = _a, restResponse = __rest(_a, ["data"]);
        const chapters = data.map((chapter) => (0, mangadex_service_1.mangadexToChapter)(chapter));
        const meta = {
            page: restResponse.offset / restResponse.limit + 1,
            limit: restResponse.limit,
            totalItems: restResponse.total,
            totalPages: Math.ceil(restResponse.total / restResponse.limit),
        };
        return {
            data: chapters,
            meta,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getChaptersByMangaId = getChaptersByMangaId;
const getChapterContent = (chapterId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = getChapterImagesUrl(chapterId);
    const response = yield axios_1.default.get(url);
    const { data } = response;
    const result = [];
    const imageLength = data.chapter.data.length;
    for (let i = 0; i < imageLength; i++) {
        const image = data.chapter.data[i];
        const compressed = data.chapter.dataSaver[i];
        result.push({
            data: `${data.baseUrl}/data/${data.chapter.hash}/${image}`,
            dataSaver: `${data.baseUrl}/data-saver/${data.chapter.hash}/${compressed}`,
        });
    }
    return result;
});
exports.getChapterContent = getChapterContent;
//# sourceMappingURL=mangadex.controller.js.map