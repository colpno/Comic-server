import { Router } from 'express';

import { getComicList } from '../controllers/comic.controller';
import { validateGetComics } from '../validations/comic.validation';

const router = Router();

router.get('/', validateGetComics, getComicList);

const comicRouter = router;
export default comicRouter;
