"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
router.get('/csrf-token', controllers_1.authController.generateCSRFToken);
router.get('/logout', middlewares_1.isAuthenticated, controllers_1.authController.logout);
router.get('/refresh-token', middlewares_1.isAuthenticated, controllers_1.authController.refreshAccessToken);
router.post('/login', validations_1.authValidator.login, controllers_1.authController.login);
router.post('/register', validations_1.authValidator.register, controllers_1.authController.register);
router.put('/password/reset', middlewares_1.isAuthenticated, validations_1.authValidator.resetPassword, controllers_1.authController.resetPassword);
const authRouter = router;
exports.default = authRouter;
//# sourceMappingURL=auth.route.js.map