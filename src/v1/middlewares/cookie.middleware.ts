import cookieParser from 'cookie-parser';

import { COOKIE_SECRET } from '../configs/common.conf';

const middleware = cookieParser(COOKIE_SECRET);

export default middleware;
