import { Router } from 'express';

import { getChaptersByMangaId, getManga } from '../controllers/mangadex.controller';

const router = Router();

router.get('/manga/:id/chapters', getChaptersByMangaId);
router.get('/manga', getManga);

const mangadexRouter = router;
export default mangadexRouter;
