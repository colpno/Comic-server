import express from 'express';

import { BASE_ENDPOINT } from './constants/common.constant';
import { cookieParser, cors, errorHandler } from './middlewares';
import router from './routes';

const v1App = express();

v1App.use(cors);
v1App.use(cookieParser);

v1App.use(BASE_ENDPOINT, router);

v1App.use(errorHandler);

export default v1App;
