import { Router } from 'express';

import { authController } from '../controllers';

const router = Router();

router.get('/csrf-token', authController.generateCSRFToken);

const authRouter = router;
export default authRouter;
