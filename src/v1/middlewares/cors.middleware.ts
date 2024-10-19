import cors, { CorsOptions } from 'cors';

import { CORS_ORIGINS } from '../configs/common.conf';

const options: CorsOptions = {
  origin: CORS_ORIGINS.split(' '),
  credentials: true,
};

const middleware = cors(options);

export default middleware;
