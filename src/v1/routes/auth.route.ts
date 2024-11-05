import { Router } from 'express';

import { authController } from '../controllers';
import { doubleCsrfProtection } from '../middlewares';
import { authValidator } from '../validations';

const router = Router();

router.get('/csrf-token', authController.generateCSRFToken);

router.use(doubleCsrfProtection);

router.post('/login', authValidator.login, authController.login);

const authRouter = router;
export default authRouter;
