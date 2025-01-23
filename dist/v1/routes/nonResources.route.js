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
const express_1 = require("express");
const tspec_1 = require("tspec");
const common_conf_1 = require("../configs/common.conf");
const tspec_conf_1 = __importDefault(require("../configs/tspec.conf"));
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
(() => __awaiter(void 0, void 0, void 0, function* () {
    common_conf_1.APP_ENVIRONMENT === 'development' && router.use('/docs', yield (0, tspec_1.TspecDocsMiddleware)(tspec_conf_1.default));
}))();
router.get('/health', controllers_1.nonResourcesController.healthCheck);
const nonResourcesRouter = router;
exports.default = nonResourcesRouter;
//# sourceMappingURL=nonResources.route.js.map