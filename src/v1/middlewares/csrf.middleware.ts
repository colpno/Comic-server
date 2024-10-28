import { doubleCsrf } from 'csrf-csrf';

import csrfConfig from '../configs/csrf.conf';

export const {
  generateToken, // Use this in your routes to provide a CSRF hash + token cookie and token.
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf(csrfConfig);
