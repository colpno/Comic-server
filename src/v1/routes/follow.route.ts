import { Router } from 'express';

import { followController } from '../controllers';
import { followValidator } from '../validations';

const router = Router();

router.get('/:following', followValidator.getFollow, followController.getFollow);
router.get('/', followValidator.getFollowList, followController.getFollowList);

router.post('/', followValidator.addFollow, followController.addFollow);

router.delete('/:id', followValidator.removeFollow, followController.removeFollow);

const followRouter = router;
export default followRouter;
