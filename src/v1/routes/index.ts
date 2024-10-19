import { Router } from 'express';

import mangadexRouter from './mangadex.route';

const router = Router();

router.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/mangadex', mangadexRouter);

export default router;
