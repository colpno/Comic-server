"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const rateLimiter_middleware_1 = __importDefault(require("../middlewares/rateLimiter.middleware"));
const converter_util_1 = require("../utils/converter.util");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
router.get('/:id/chapters', validations_1.chapterValidator.getChaptersByComicId, controllers_1.chapterController.getChaptersByComicId);
router.get('/:title/reading/:chapter', (0, rateLimiter_middleware_1.default)({ limit: 30, windowMs: (0, converter_util_1.toMS)(1, 'minute') }), validations_1.comicValidator.getReadingChapter, controllers_1.comicController.getReadingChapter);
router.get('/:title', validations_1.comicValidator.getComicByTitle, controllers_1.comicController.getComicByTitle);
router.get('/', validations_1.comicValidator.getComicList, controllers_1.comicController.getComicList);
const comicRouter = router;
exports.default = comicRouter;
//# sourceMappingURL=comic.route.js.map