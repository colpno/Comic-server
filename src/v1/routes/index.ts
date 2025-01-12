import { Router } from 'express';
import { TspecDocsMiddleware } from 'tspec';

import { HTTP_200_OK } from '../../constants/httpCode.constant';
import tspecConfig from '../configs/tspec.conf';
import { isAuthenticated } from '../middlewares';
import authRouter from './auth.route';
import chapterRouter from './chapter.route';
import comicRouter from './comic.route';
import followRouter from './follow.route';
import genreRouter from './genre.route';

const router = Router();

router.get('/health', (_, res) => res.status(HTTP_200_OK).json({ status: 'ok' }));
(async () => router.use('/docs', isAuthenticated, await TspecDocsMiddleware(tspecConfig)))();

router.use('/auth', authRouter);

router.use('/comics', comicRouter);
router.use('/chapters', chapterRouter);
router.use('/follows', isAuthenticated, followRouter);
router.use('/genres', genreRouter);

export default router;
