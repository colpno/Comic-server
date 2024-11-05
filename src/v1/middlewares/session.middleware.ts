import session from 'express-session';

import { SessionStore } from '../../databases/MongoDB.database';
import { COOKIE_SECRET } from '../configs/common.conf';
import cookieConfig from '../configs/cookie.conf';
import { Error500 } from '../utils/error.utils';

const sessionStore = new SessionStore(session).getStore();
sessionStore?.on('error', (error) => {
  throw new Error500(error);
});

const middleware = session({
  secret: COOKIE_SECRET,
  cookie: cookieConfig,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
});

export default middleware;
