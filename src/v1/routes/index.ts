import { Router } from 'express';

import { isAuthenticated } from '../middlewares';
import authRouter from './auth.route';
import chapterRouter from './chapter.route';
import comicRouter from './comic.route';
import followRouter from './follow.route';
import genreRouter from './genre.route';
import nonResourcesRouter from './nonResources.route';

const router = Router();

router.use('', nonResourcesRouter);
router.use('/auth', authRouter);
router.use('/comics', comicRouter);
router.use('/chapters', chapterRouter);
router.use('/follows', isAuthenticated, followRouter);
router.use('/genres', genreRouter);

export default router;
