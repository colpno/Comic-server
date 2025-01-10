import { CookieOptions } from 'express';

import { APP_ENVIRONMENT, COOKIE_DOMAIN } from './common.conf';

type CookieConfig = Omit<CookieOptions, 'maxAge' | 'httpOnly' | 'sameSite'> & {
  maxAge: number;
  httpOnly: boolean;
  sameSite: Exclude<CookieOptions['sameSite'], undefined>;
};

const config: Omit<CookieConfig, 'maxAge'> = {
  httpOnly: true,
  secure: APP_ENVIRONMENT === 'production',
  sameSite: APP_ENVIRONMENT === 'production' ? 'none' : 'lax',
  domain: APP_ENVIRONMENT === 'production' ? COOKIE_DOMAIN : undefined,
  // overwrite: true,
  // signed: true,
};

export const cookieConfig: CookieConfig = {
  ...config,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
};

export const clearCookieConfig: typeof config = config;
