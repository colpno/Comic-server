import { Router } from 'express';

import { chapterController } from '../controllers';
import rateLimiter from '../middlewares/rateLimiter.middleware';
import { toMS } from '../utils/converter.util';
import { chapterValidator } from '../validations';

const router = Router();

router.get(
  '/:id/content',
  rateLimiter({ limit: 30, windowMs: toMS(1, 'minute') }),
  chapterValidator.getChapterContent,
  chapterController.getChapterContent
);

const chapterRouter = router;
export default chapterRouter;
