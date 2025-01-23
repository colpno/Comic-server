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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadingChapter = exports.getComicByTitle = exports.getComicList = void 0;
const common_constant_1 = require("../constants/common.constant");
const services_1 = require("../services");
const error_utils_1 = require("../utils/error.utils");
const mangadex_util_1 = require("../utils/mangadex.util");
const meta_util_1 = require("../utils/meta.util");
const _1 = require("./");
const mangadex_controller_1 = require("./mangadex.controller");
const getComicList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { _limit, _page } = _a, query = __rest(_a, ["_limit", "_page"]);
        const { data: comics, meta } = yield services_1.comicService.getComicList(Object.assign(Object.assign({}, query), { _limit,
            _page }));
        const result = {
            data: comics,
            metadata: {
                pagination: (0, meta_util_1.generatePaginationMeta)({
                    page: _page || 1, // default page is 1
                    perPage: _limit || 100, // default perPage is 100 based on mangadex
                    endpoint: `${common_constant_1.BASE_ENDPOINT}/comics`,
                    totalItems: meta.totalItems,
                    totalPages: meta.totalPages,
                }),
            },
        };
        return res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getComicList = getComicList;
const getComicByTitle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.params;
        const { _embed } = req.query;
        const comic = yield (0, mangadex_controller_1.getMangaByTitle)(title, { includes: (0, mangadex_util_1.toMangaDexEmbedValue)(_embed) });
        return res.json({ data: comic });
    }
    catch (error) {
        next(error);
    }
});
exports.getComicByTitle = getComicByTitle;
const getReadingChapter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chapter: chapterNumber, title } = req.params;
        // Get comic by title
        const comic = yield (0, mangadex_controller_1.getMangaByTitle)(title, { includes: ['cover_art'] });
        if (!comic) {
            throw new error_utils_1.Error400('Comic not found');
        }
        // Get chapters by comic id
        const { data: chapters, meta } = yield _1.mangadexController.getChaptersByMangaId(comic.id);
        // Get current chapter
        const currentChapterIndex = chapters.findIndex((c) => c.chapter === chapterNumber);
        if (currentChapterIndex === -1) {
            throw new error_utils_1.Error400('Chapter not found');
        }
        const chapter = chapters[currentChapterIndex];
        // Get chapter content
        const images = yield _1.mangadexController.getChapterContent(chapter.id);
        chapter.content = images;
        // Prepare pagination links
        const nextChapter = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;
        const previousChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
        const nextChapterLink = (nextChapter === null || nextChapter === void 0 ? void 0 : nextChapter.chapter)
            ? `/comics/${title}/reading/${nextChapter.chapter}`
            : undefined;
        const previousChapterLink = (previousChapter === null || previousChapter === void 0 ? void 0 : previousChapter.chapter)
            ? `/comics/${title}/reading/${previousChapter.chapter}`
            : undefined;
        return res.json({
            data: {
                comic: {
                    id: comic.id,
                    title: comic.title,
                    coverImageUrl: comic.coverImageUrl,
                },
                chapter,
            },
            metadata: {
                pagination: {
                    currentPage: 1,
                    perPage: 1,
                    totalItems: meta.totalItems,
                    totalPages: meta.totalPages,
                    links: {
                        next: nextChapterLink,
                        previous: previousChapterLink,
                    },
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getReadingChapter = getReadingChapter;
//# sourceMappingURL=comic.controller.js.map