import { Router } from 'express';

import chapterRouter from './chapter.route';
import comicRouter from './comic.route';

const router = Router();

router.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));

router.use('/comics', comicRouter);
router.use('/chapters', chapterRouter);

export default router;
