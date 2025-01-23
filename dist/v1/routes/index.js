"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const auth_route_1 = __importDefault(require("./auth.route"));
const chapter_route_1 = __importDefault(require("./chapter.route"));
const comic_route_1 = __importDefault(require("./comic.route"));
const follow_route_1 = __importDefault(require("./follow.route"));
const genre_route_1 = __importDefault(require("./genre.route"));
const nonResources_route_1 = __importDefault(require("./nonResources.route"));
const router = (0, express_1.Router)();
router.use('', nonResources_route_1.default);
router.use('/auth', auth_route_1.default);
router.use('/comics', comic_route_1.default);
router.use('/chapters', chapter_route_1.default);
router.use('/follows', middlewares_1.isAuthenticated, follow_route_1.default);
router.use('/genres', genre_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map