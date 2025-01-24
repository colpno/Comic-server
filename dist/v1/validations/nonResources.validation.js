"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxy = void 0;
const httpCode_constant_1 = require("../../constants/httpCode.constant");
const joi_conf_1 = require("../configs/joi.conf");
const validation_util_1 = require("../utils/validation.util");
const _1 = require("./");
const proxy = (req, res, next) => {
    const reqParams = {
        proxyUrl: `${req.params.proxyUrl}${req.params[0]}`,
    };
    const schema = joi_conf_1.Joi.object({
        proxyUrl: joi_conf_1.Joi.string().uri().required(),
    });
    const { error, value } = schema.validate(reqParams, _1.validationOptions);
    if (error) {
        return res.status(httpCode_constant_1.HTTP_400_BAD_REQUEST).json((0, validation_util_1.processValidationError)(error));
    }
    req.originalParams = reqParams;
    req.params = value;
    next();
};
exports.proxy = proxy;
//# sourceMappingURL=nonResources.validation.js.map