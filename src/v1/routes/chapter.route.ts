import { Router } from 'express';

import { chapterController } from '../controllers';
import { chapterValidator } from '../validations';

const router = Router();

router.get('/:id/content', chapterValidator.getChapterContent, chapterController.getChapterContent);

const chapterRouter = router;
export default chapterRouter;
