import { Router } from 'express';

import { chapterController, comicController } from '../controllers';
import { chapterValidator, comicValidator } from '../validations';

const router = Router();

router.get(
  '/:id/chapters',
  chapterValidator.getChaptersByComicId,
  chapterController.getChaptersByComicId
);
router.get('/:title', comicValidator.getComicByTitle, comicController.getComicByTitle);
router.get('/', comicValidator.getComicList, comicController.getComicList);

const comicRouter = router;
export default comicRouter;
