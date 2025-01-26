import { Router } from 'express';

import { authController } from '../controllers';
import { isAuthenticated } from '../middlewares';
import { authValidator } from '../validations';

const router = Router();

router.get('/csrf-token', authController.generateCSRFToken);
router.get('/logout', isAuthenticated, authController.logout);
router.get('/refresh-token', isAuthenticated, authController.refreshAccessToken);

router.post('/login', authValidator.login, authController.login);
router.post('/register', authValidator.register, authController.register);

router.put(
  '/password/reset',
  isAuthenticated,
  authValidator.resetPassword,
  authController.resetPassword
);
router.put('/password/forgot', authValidator.resetPassword, authController.resetPassword);

const authRouter = router;
export default authRouter;
