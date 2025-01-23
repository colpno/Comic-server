import { Router } from 'express';
import { TspecDocsMiddleware } from 'tspec';

import { APP_ENVIRONMENT } from '../configs/common.conf';
import tspecConfig from '../configs/tspec.conf';
import { nonResourcesController } from '../controllers';

const router = Router();

(async () => {
  APP_ENVIRONMENT === 'development' && router.use('/docs', await TspecDocsMiddleware(tspecConfig));
})();

router.get('/health', nonResourcesController.healthCheck);

const nonResourcesRouter = router;
export default nonResourcesRouter;
