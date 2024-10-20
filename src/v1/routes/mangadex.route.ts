import { Router } from 'express';

import { getChaptersByMangaId, getManga } from '../controllers/mangadex.controller';
import { validateGetChapters, validateGetManga } from '../validations/mangadex.validation';

const router = Router();

router.get('/manga/:id/chapters', validateGetChapters, getChaptersByMangaId);
router.get('/manga', validateGetManga, getManga);

const mangadexRouter = router;
export default mangadexRouter;
