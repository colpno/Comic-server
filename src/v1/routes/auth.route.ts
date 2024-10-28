import { Router } from 'express';

import { generateCSRFToken } from '../controllers/auth.controller';

const router = Router();

router.get('/csrf-token', generateCSRFToken);

const authRouter = router;
export default authRouter;
