import cors from 'cors';

import { CORS_ORIGINS } from '../configs/common.conf';
import { Error403 } from '../utils/error.utils';

const whitelistRegex = CORS_ORIGINS.split(' ').map((origin) => new RegExp(origin));

const middleware = cors({
  origin: function (origin, callback) {
    const isAllowed = whitelistRegex.some((regex) => regex.test(origin)) || !origin;

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error403('Not allowed by CORS'));
    }
  },
  credentials: true,
});

export default middleware;
