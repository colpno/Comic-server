"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    follower: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    following: {
        type: String,
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
schema.post('find', function (result) {
    if (Array.isArray(result)) {
        const results = result.map(({ _doc }) => {
            const { _id, __v } = _doc, rest = __rest(_doc, ["_id", "__v"]);
            rest.id = _id;
            return rest;
        });
        return mongoose_1.default.overwriteMiddlewareResult(results);
    }
});
const FollowModel = mongoose_1.default.model('follows', schema);
exports.default = FollowModel;
//# sourceMappingURL=follow.model.js.map