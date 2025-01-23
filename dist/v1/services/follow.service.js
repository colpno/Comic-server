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
exports.removeFollow = exports.createFollow = exports.getFollow = exports.getFollows = exports._Pipeline = void 0;
const models_1 = require("../models");
const Pipeline_util_1 = __importDefault(require("../utils/Pipeline.util"));
const projectFields = (projectionString) => {
    projectionString = projectionString.replace('id', '_id');
    const allExclusion = projectionString.split(' ').every((field) => field.startsWith('-'));
    if (allExclusion)
        return `${projectionString} -follower`;
    return projectionString;
};
exports._Pipeline = new Pipeline_util_1.default();
const getFollows = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    var { _page = 1, _limit = 1 } = _a, filter = __rest(_a, ["_page", "_limit"]);
    if (filter._select)
        filter._select = projectFields(filter._select);
    else
        filter._select = '-follower';
    const pipeline = exports._Pipeline.generate(filter);
    const result = yield models_1.FollowModel.aggregate(pipeline);
    const { _sort } = filter, otherQueries = __rest(filter, ["_sort"]);
    const count = yield models_1.FollowModel.aggregate(exports._Pipeline.countingPipeline(otherQueries, pipeline));
    const total = ((_b = count === null || count === void 0 ? void 0 : count[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
    return {
        total,
        totalPages: Math.ceil(total / _limit),
        page: _page || 1,
        perPage: _limit,
        pageSize: result.length,
        data: result,
    };
});
exports.getFollows = getFollows;
const getFollow = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    if (filter._select)
        filter._select = projectFields(filter._select);
    else
        filter._select = '-follower';
    const pipeline = exports._Pipeline.generate(filter);
    pipeline.push({ $limit: 1 });
    const results = yield models_1.FollowModel.aggregate(pipeline);
    return results[0] || null;
});
exports.getFollow = getFollow;
const createFollow = (follow) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.FollowModel.create(follow);
});
exports.createFollow = createFollow;
const removeFollow = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.FollowModel.deleteOne(filter);
});
exports.removeFollow = removeFollow;
//# sourceMappingURL=follow.service.js.map