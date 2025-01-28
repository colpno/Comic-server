"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const joi_conf_1 = require("../configs/joi.conf");
const validation_util_1 = require("../utils/validation.util");
const _1 = require("./");
const updateUser = (req, res, next) => {
    const scheme = joi_conf_1.Joi.object({
        email: joi_conf_1.Joi.string().email(),
        password: joi_conf_1.Joi.string().min(12),
        passwordVerification: joi_conf_1.Joi.string().valid(joi_conf_1.Joi.ref('password')),
    });
    const { error, value } = scheme.validate(req.body, _1.validationOptions);
    if (error) {
        return res.status(400).json((0, validation_util_1.processValidationError)(error));
    }
    req.originalBody = req.body;
    req.body = value;
    next();
};
exports.updateUser = updateUser;
//# sourceMappingURL=user.validation.js.map