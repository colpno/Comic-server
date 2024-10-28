import cors from 'cors';

import { CORS_ORIGINS } from '../configs/common.conf';

const middleware = cors({
  origin: CORS_ORIGINS.split(' '),
  credentials: true,
});

export default middleware;
