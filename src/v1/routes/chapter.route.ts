import { Router } from 'express';

import { getChapterContent } from '../controllers/chapter.controller';
import { validateGetChapterContent } from '../validations/chapter.validation';

const router = Router();

router.get('/:id/content', validateGetChapterContent, getChapterContent);

const chapterRouter = router;
export default chapterRouter;
