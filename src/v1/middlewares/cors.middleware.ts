import cors, { CorsOptions } from 'cors';

import { CORS_ORIGINS } from '../configs/common.conf';

const options: CorsOptions = {
  origin: CORS_ORIGINS.split(' '),
};

const middleware = cors(options);

export default middleware;
