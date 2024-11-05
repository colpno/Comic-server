import { CookieOptions } from 'express';

import { APP_ENVIRONMENT, COOKIE_DOMAIN } from './common.conf';

type CookieConfig = Omit<CookieOptions, 'maxAge' | 'httpOnly' | 'sameSite'> & {
  maxAge: number;
  httpOnly: boolean;
  sameSite: Exclude<CookieOptions['sameSite'], undefined>;
};

const cookieConfig: CookieConfig = {
  maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  httpOnly: true,
  secure: APP_ENVIRONMENT === 'production',
  sameSite: APP_ENVIRONMENT === 'production' ? 'none' : 'lax',
  domain: APP_ENVIRONMENT === 'production' ? COOKIE_DOMAIN : undefined,
};

export default cookieConfig;
