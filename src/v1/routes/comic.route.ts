import { Router } from 'express';

import { getComicById, getComicList } from '../controllers/comic.controller';
import { validateGetComicById, validateGetComicList } from '../validations/comic.validation';

const router = Router();

router.get('/:id', validateGetComicById, getComicById);
router.get('/', validateGetComicList, getComicList);

const comicRouter = router;
export default comicRouter;
