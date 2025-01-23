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
exports.getComicList = void 0;
const mangadex_controller_1 = require("../controllers/mangadex.controller");
const mangadex_util_1 = require("../utils/mangadex.util");
const getComicList = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { includedTags, _embed, _sort, _limit, _page } = _a, query = __rest(_a, ["includedTags", "_embed", "_sort", "_limit", "_page"]);
    const tagIds = includedTags && includedTags.length > 0 ? yield (0, mangadex_controller_1.getTagIdList)(includedTags) : undefined;
    const result = yield (0, mangadex_controller_1.getMangaList)(Object.assign(Object.assign({}, query), { includedTags: tagIds, includes: (0, mangadex_util_1.toMangaDexEmbedValue)(_embed), order: _sort, limit: _limit, offset: (0, mangadex_util_1.calculateOffset)(_limit, _page) }));
    return result;
});
exports.getComicList = getComicList;
//# sourceMappingURL=comic.service.js.map