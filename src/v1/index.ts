import express from 'express';

import { BASE_ENDPOINT } from './configs/common.conf';
import { cookieParser, cors, doubleCsrfProtection, errorHandler, session } from './middlewares';
import router from './routes';

const v1App = express();

v1App.use(cors);
v1App.use(session);
v1App.use(cookieParser);

v1App.use(BASE_ENDPOINT, router);

v1App.use(doubleCsrfProtection);
v1App.use(errorHandler);

export default v1App;
