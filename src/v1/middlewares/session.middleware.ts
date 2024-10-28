import { config } from 'dotenv';
import expressSession from 'express-session';

import cookieConfig from '~/v1/configs/cookie.conf';
import { Error500 } from '../utils/error.utils';

config();

if (!process.env.COOKIE_SECRET) {
  throw new Error500('COOKIE_SECRET is not defined');
}

const session = expressSession({
  secret: process.env.COOKIE_SECRET,
  cookie: cookieConfig,
  resave: false,
  saveUninitialized: false,
});

export default session;
