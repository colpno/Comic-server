import csurf from 'csurf';
import express from 'express';

import { cookieConfig } from './configs/cookie.conf';
import { BASE_ENDPOINT } from './constants/common.constant';
import { cookieCORS, cookieParser, cors, errorHandler } from './middlewares';
import rateLimiter from './middlewares/rateLimiter.middleware';
import router from './routes';

const v1App = express();

v1App.use(cors);
v1App.use(rateLimiter());
v1App.use(cookieCORS);
v1App.use(cookieParser);
v1App.use(csurf({ cookie: cookieConfig }));

v1App.use(BASE_ENDPOINT, router);

v1App.use(errorHandler);

export default v1App;
