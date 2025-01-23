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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenreList = void 0;
const _1 = require("./");
const getGenreList = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genresRaw = yield _1.mangadexController.getTagList();
        const genres = genresRaw.map((genre) => {
            var _a;
            return ({
                id: genre.id,
                name: genre.attributes.name.en,
                description: (_a = genre.attributes.description) === null || _a === void 0 ? void 0 : _a.en,
                group: genre.attributes.group,
            });
        });
        return res.json({ data: genres });
    }
    catch (error) {
        next(error);
    }
});
exports.getGenreList = getGenreList;
//# sourceMappingURL=genre.controller.js.map