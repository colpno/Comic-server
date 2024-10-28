import { doubleCsrf } from 'csrf-csrf';
import { config } from 'dotenv';

import cookieConfig from '../configs/cookie.conf';
import { Error500 } from '../utils/error.utils';

config();

const { CSRF_SECRET } = process.env;

if (!CSRF_SECRET) {
  throw new Error500('CSRF_SECRET is not defined');
}

const { maxAge, sameSite, secure, domain } = cookieConfig;

export const {
  generateToken, // Use this in your routes to provide a CSRF hash + token cookie and token.
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  cookieName: '__Secure-psifi.x-csrf-token',
  cookieOptions: { maxAge, sameSite, secure, domain },
});
