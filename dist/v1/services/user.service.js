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
exports.updateUser = exports.createUser = exports.getUser = void 0;
const models_1 = require("../models");
const getUser = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.UserModel.findOne(filter);
    return user;
});
exports.getUser = getUser;
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.UserModel.create(Object.assign(Object.assign({}, data), { uuid: crypto.randomUUID() }));
    return user;
});
exports.createUser = createUser;
const updateUser = (filter, update) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.UserModel.findOneAndUpdate(filter, update, { new: true });
    return user;
});
exports.updateUser = updateUser;
//# sourceMappingURL=user.service.js.map