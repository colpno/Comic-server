import { Router } from 'express';

import { authController } from '../controllers';
import { isAuthenticated } from '../middlewares';
import { authValidator } from '../validations';

const router = Router();

router.get('/csrf-token', authController.generateCSRFToken);
router.get('/logout', isAuthenticated, authController.logout);
router.get('/refresh-token', authController.refreshAccessToken);

router.post('/login', authValidator.login, authController.login);
router.post('/register', authValidator.register, authController.register);

router.put('/reset-password', authValidator.resetPassword, authController.resetPassword);

const authRouter = router;
export default authRouter;
