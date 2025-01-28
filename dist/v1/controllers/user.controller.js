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
exports.updateUser = exports.getUser = void 0;
const services_1 = require("../services");
const converter_util_1 = require("../utils/converter.util");
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const data = yield services_1.userService.getUser({ _id: (0, converter_util_1.toObjectId)(userId) });
        return res.status(200).json({
            data: {
                email: data.email,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { password, passwordVerification } = _a, restBody = __rest(_a, ["password", "passwordVerification"]);
        const { userId } = req.user;
        // Check if passwords match
        if (password !== passwordVerification) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        // Update user
        const updatePayload = Object.assign({}, restBody);
        if (password)
            updatePayload.password = password;
        yield services_1.userService.updateUser({ _id: (0, converter_util_1.toObjectId)(userId) }, updatePayload);
        return res.status(200).json({ message: 'User updated' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
//# sourceMappingURL=user.controller.js.map