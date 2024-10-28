import { DoubleCsrfConfigOptions } from 'csrf-csrf';
import { config } from 'dotenv';

import cookieConfig from '~/v1/configs/cookie.conf';
import { Error500 } from '../utils/error.utils';

config();

if (!process.env.CSRF_SECRET) {
  throw new Error500('CSRF_SECRET is not defined');
}

const { maxAge, sameSite, secure, domain } = cookieConfig;

const csrfConfig: DoubleCsrfConfigOptions = {
  getSecret: () => process.env.CSRF_SECRET!,
  cookieName: '__Secure-psifi.x-csrf-token',
  cookieOptions: { maxAge, sameSite, secure, domain },
};

export default csrfConfig;
