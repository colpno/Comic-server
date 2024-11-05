import { doubleCsrf } from 'csrf-csrf';

import { COOKIE_NAME_CSRF_TOKEN, CSRF_SECRET } from '../configs/common.conf';
import cookieConfig from '../configs/cookie.conf';

const { maxAge, sameSite, secure, domain } = cookieConfig;

export const {
  generateToken, // Use this in your routes to provide a CSRF hash + token cookie and token.
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf({
  getSecret: () => CSRF_SECRET,
  getTokenFromRequest: (req) => req.headers['x-csrf-token'] as string,
  cookieName: COOKIE_NAME_CSRF_TOKEN,
  cookieOptions: { maxAge, sameSite, secure, domain },
});
