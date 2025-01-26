"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.register = exports.login = void 0;
const joi_conf_1 = require("../configs/joi.conf");
const validation_util_1 = require("../utils/validation.util");
const _1 = require("./");
const login = (req, res, next) => {
    const scheme = joi_conf_1.Joi.object({
        email: joi_conf_1.Joi.string().email().required(),
        password: joi_conf_1.Joi.string().min(12).required(),
        rememberMe: joi_conf_1.Joi.boolean().optional(),
    });
    const { error, value } = scheme.validate(req.body, _1.validationOptions);
    if (error) {
        return res.status(400).json((0, validation_util_1.processValidationError)(error));
    }
    req.originalBody = req.body;
    req.body = value;
    next();
};
exports.login = login;
const register = (req, res, next) => {
    const scheme = joi_conf_1.Joi.object({
        email: joi_conf_1.Joi.string().email().required(),
        password: joi_conf_1.Joi.string().min(12).required(),
        passwordVerification: joi_conf_1.Joi.string().valid(joi_conf_1.Joi.ref('password')).required(),
    });
    const { error, value } = scheme.validate(req.body, _1.validationOptions);
    if (error) {
        return res.status(400).json((0, validation_util_1.processValidationError)(error));
    }
    req.originalBody = req.body;
    req.body = value;
    next();
};
exports.register = register;
const resetPassword = (req, res, next) => {
    const scheme = joi_conf_1.Joi.object({
        password: joi_conf_1.Joi.string().min(12).required(),
        passwordVerification: joi_conf_1.Joi.string().valid(joi_conf_1.Joi.ref('password')).required(),
    });
    const { error, value } = scheme.validate(req.body, _1.validationOptions);
    if (error) {
        return res.status(400).json((0, validation_util_1.processValidationError)(error));
    }
    req.originalBody = req.body;
    req.body = value;
    next();
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.validation.js.map