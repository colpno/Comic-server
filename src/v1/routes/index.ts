import { Router } from 'express';

import comicRouter from './comic.route';

const router = Router();

router.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));

router.use('/comics', comicRouter);

export default router;
