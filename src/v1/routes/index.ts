import { Router } from 'express';

import { HTTP_200_OK } from '../../constants/httpCode.constant';
import authRouter from './auth.route';
import chapterRouter from './chapter.route';
import comicRouter from './comic.route';

const router = Router();

router.get('/health', (_, res) => res.status(HTTP_200_OK).json({ status: 'ok' }));

router.use('/auth', authRouter);
router.use('/comics', comicRouter);
router.use('/chapters', chapterRouter);

export default router;
