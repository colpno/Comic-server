import { Router } from 'express';
import { TspecDocsMiddleware } from 'tspec';

import { APP_ENVIRONMENT } from '../configs/common.conf';
import tspecConfig from '../configs/tspec.conf';
import { nonResourcesController } from '../controllers';
import rateLimiter from '../middlewares/rateLimiter.middleware';
import { toMS } from '../utils/converter.util';
import { nonResourcesValidator } from '../validations';

const router = Router();

(async () => {
  APP_ENVIRONMENT === 'development' && router.use('/docs', await TspecDocsMiddleware(tspecConfig));
})();

router.get('/health', nonResourcesController.healthCheck);
router.get(
  '/proxy/:proxyUrl',
  rateLimiter({ limit: 100, windowMs: toMS(10, 'seconds') }),
  nonResourcesValidator.proxy,
  nonResourcesController.proxy
);

const nonResourcesRouter = router;
export default nonResourcesRouter;
