import { RequestHandler, Router } from 'express';

import { chapterController, comicController } from '../controllers';
import { chapterValidator, comicValidator } from '../validations';

const router = Router();

router.get(
  '/search',
  comicValidator.searchComics,
  comicController.searchComics as unknown as RequestHandler
);
router.get(
  '/:id/chapters',
  chapterValidator.getChaptersByComicId,
  chapterController.getChaptersByComicId
);
router.get('/:id', comicValidator.getComicById, comicController.getComicById);
router.get('/', comicValidator.getComicList, comicController.getComicList);

const comicRouter = router;
export default comicRouter;
