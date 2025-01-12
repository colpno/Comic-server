import { Router } from 'express';

import { genreController } from '../controllers';

const router = Router();

router.get('/', genreController.getGenreList);

const genreRouter = router;
export default genreRouter;
