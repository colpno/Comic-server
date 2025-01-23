"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getChapterContent = exports.getChaptersByComicId = void 0;
const common_constant_1 = require("../constants/common.constant");
const mangadex_util_1 = require("../utils/mangadex.util");
const meta_util_1 = require("../utils/meta.util");
const mangadexController = __importStar(require("./mangadex.controller"));
const getChaptersByComicId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: mangaId } = req.params;
        const _a = req.query, { _limit, _page, _sort } = _a, query = __rest(_a, ["_limit", "_page", "_sort"]);
        const queryParams = {
            exclude: query.exclude,
            include: query.include,
            limit: _limit,
            offset: (0, mangadex_util_1.calculateOffset)(_limit, _page),
            order: _sort,
        };
        const response = yield mangadexController.getChaptersByMangaId(mangaId, queryParams);
        const { data, meta } = response;
        const result = {
            data,
        };
        if (_limit && _page) {
            result.metadata = {
                pagination: (0, meta_util_1.generatePaginationMeta)({
                    page: _page,
                    perPage: _limit,
                    endpoint: `${common_constant_1.BASE_ENDPOINT}/${mangaId}/chapters`,
                    totalItems: meta.totalItems,
                    totalPages: meta.totalPages,
                }),
            };
        }
        return res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getChaptersByComicId = getChaptersByComicId;
const getChapterContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const ChapterContent = yield mangadexController.getChapterContent(id);
        return res.json({ data: ChapterContent });
    }
    catch (error) {
        next(error);
    }
});
exports.getChapterContent = getChapterContent;
//# sourceMappingURL=chapter.controller.js.map