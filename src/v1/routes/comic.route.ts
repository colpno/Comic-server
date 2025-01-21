import { Router } from 'express';

import { chapterController, comicController } from '../controllers';
import rateLimiter from '../middlewares/rateLimiter.middleware';
import { toMS } from '../utils/converter.util';
import { chapterValidator, comicValidator } from '../validations';

const router = Router();

router.get(
  '/:id/chapters',
  chapterValidator.getChaptersByComicId,
  chapterController.getChaptersByComicId
);
router.get(
  '/:title/reading/:chapter',
  rateLimiter({ limit: 30, windowMs: toMS(1, 'minute') }),
  comicValidator.getReadingChapter,
  comicController.getReadingChapter
);
router.get('/:title', comicValidator.getComicByTitle, comicController.getComicByTitle);
router.get('/', comicValidator.getComicList, comicController.getComicList);

const comicRouter = router;
export default comicRouter;
