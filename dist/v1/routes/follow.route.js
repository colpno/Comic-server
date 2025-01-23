"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validations_1 = require("../validations");
const router = (0, express_1.Router)();
// @ts-expect-error
router.get('/:following', validations_1.followValidator.getFollow, controllers_1.followController.getFollow);
router.get('/', validations_1.followValidator.getFollowList, controllers_1.followController.getFollowList);
router.post('/', validations_1.followValidator.addFollow, controllers_1.followController.addFollow);
router.delete('/:id', validations_1.followValidator.removeFollow, controllers_1.followController.removeFollow);
const followRouter = router;
exports.default = followRouter;
//# sourceMappingURL=follow.route.js.map