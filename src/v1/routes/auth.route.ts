import { Router } from 'express';

import { authController, userController } from '../controllers';
import { isAuthenticated } from '../middlewares';
import { authValidator, userValidator } from '../validations';

const router = Router();

router.get('/csrf-token', authController.generateCSRFToken);
router.get('/logout', isAuthenticated, authController.logout);
router.get('/refresh-token', isAuthenticated, authController.refreshAccessToken);
router.get('/user', isAuthenticated, userController.getUser);

router.post('/login', authValidator.login, authController.login);
router.post('/register', authValidator.register, authController.register);

router.put(
  '/password/reset',
  isAuthenticated,
  authValidator.resetPassword,
  authController.resetPassword
);
router.put('/password/forgot', authValidator.resetPassword, authController.resetPassword);
router.put('/user', isAuthenticated, userValidator.updateUser, userController.updateUser);

const authRouter = router;
export default authRouter;
