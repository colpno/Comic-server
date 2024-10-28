import { config } from 'dotenv';
import { CookieOptions } from 'express';

config();

type CookieConfig = Omit<CookieOptions, 'maxAge' | 'httpOnly' | 'sameSite'> & {
  maxAge: number;
  httpOnly: boolean;
  sameSite: Exclude<CookieOptions['sameSite'], undefined>;
};

const cookieConfig: CookieConfig = {
  maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
};

export default cookieConfig;
