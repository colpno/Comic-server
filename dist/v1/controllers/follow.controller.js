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
exports.removeFollow = exports.addFollow = exports.getFollow = exports.getFollowList = void 0;
const httpCode_constant_1 = require("../../constants/httpCode.constant");
const common_constant_1 = require("../constants/common.constant");
const services_1 = require("../services");
const converter_util_1 = require("../utils/converter.util");
const meta_util_1 = require("../utils/meta.util");
const getFollowList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { _embed } = _a, query = __rest(_a, ["_embed"]);
        const { data, page, perPage, total, totalPages } = yield services_1.followService.getFollows(query);
        const result = {
            data: data,
            metadata: {
                pagination: (0, meta_util_1.generatePaginationMeta)({
                    page,
                    perPage,
                    endpoint: `${common_constant_1.BASE_ENDPOINT}/follows`,
                    totalItems: total,
                    totalPages,
                }),
            },
        };
        // Embed following
        if (_embed) {
            const { match = {}, populate } = typeof _embed !== 'string' ? _embed : {};
            // Get comics with ids
            const { data: comics } = yield services_1.comicService.getComicList(Object.assign(Object.assign({}, match), { ids: data.map(({ following }) => following), _embed: populate }));
            // Replace following with comic data
            result.data = data.reduce((acc, follow) => {
                const following = comics.find(({ id }) => id === follow.following);
                if (!following)
                    return acc;
                acc = [...acc, Object.assign(Object.assign({}, follow), { following })];
                return acc;
            }, []);
        }
        return res.json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getFollowList = getFollowList;
const getFollow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { following } = req.params;
        const _a = req.query, { _embed } = _a, query = __rest(_a, ["_embed"]);
        const follow = yield services_1.followService.getFollow(Object.assign(Object.assign({}, query), { following }));
        // Embed following
        if (_embed) {
            const { match = {}, populate } = typeof _embed !== 'string' ? _embed : {};
            // Get comics with ids
            const { data: comics } = yield services_1.comicService.getComicList(Object.assign(Object.assign({}, match), { ids: [follow.following], _embed: populate }));
            // Replace following with comic data
            follow.following = comics[0];
        }
        return res.json({ data: follow });
    }
    catch (error) {
        next(error);
    }
});
exports.getFollow = getFollow;
const addFollow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { followingId } = req.body;
        const { userId } = req.user;
        // Create
        yield services_1.followService.createFollow({
            follower: userId,
            following: followingId,
        });
        return res.sendStatus(httpCode_constant_1.HTTP_201_CREATED);
    }
    catch (error) {
        next(error);
    }
});
exports.addFollow = addFollow;
const removeFollow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield services_1.followService.removeFollow({ _id: (0, converter_util_1.toObjectId)(id) });
        return res.sendStatus(httpCode_constant_1.HTTP_200_OK);
    }
    catch (error) {
        next(error);
    }
});
exports.removeFollow = removeFollow;
//# sourceMappingURL=follow.controller.js.map