import { Router } from 'express';

import { getChaptersByComicId } from '../controllers/chapter.controller';
import { getComicById, getComicList } from '../controllers/comic.controller';
import { validateGetChaptersByComicId } from '../validations/chapter.validation';
import { validateGetComicById, validateGetComicList } from '../validations/comic.validation';

const router = Router();

router.get('/:id/chapters', validateGetChaptersByComicId, getChaptersByComicId);
router.get('/:id', validateGetComicById, getComicById);
router.get('/', validateGetComicList, getComicList);

const comicRouter = router;
export default comicRouter;
