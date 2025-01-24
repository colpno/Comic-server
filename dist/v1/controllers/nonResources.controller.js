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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxy = exports.healthCheck = void 0;
const axios_1 = __importDefault(require("axios"));
const services_1 = require("../services");
const healthCheck = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get('https://api.mangadex.org/ping');
        if (response.status === 200 && response.data === 'pong') {
            res.json({ status: 'ok' });
        }
        else {
            res.json({ status: 'maintenance' });
        }
    }
    catch (error) {
        res.json({ status: 'maintenance' });
    }
});
exports.healthCheck = healthCheck;
const proxy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.url = req.url.replace('/proxy/', '/'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
    services_1.corsProxy.emit('request', req, res);
});
exports.proxy = proxy;
//# sourceMappingURL=nonResources.controller.js.map