import { Router } from 'express';

import { followController } from '../controllers';
import { followValidator } from '../validations';

const router = Router();

router.get('/', followValidator.getFollowList, followController.getFollowList);
router.get('/:following', followValidator.getFollow, followController.getFollow);

router.post('/', followController.addFollow);

router.put('/', followController.addFollow);

router.delete('/:id', followController.removeFollow);

const followRouter = router;
export default followRouter;
