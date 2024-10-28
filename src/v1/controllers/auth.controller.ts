import { RequestHandler } from 'express';

import { Error500 } from '../utils/error.utils';

export const generateCSRFToken: RequestHandler = (req, res) => {
  if (!req.csrfToken) {
    throw new Error500('CSRF Token generator is not available');
  }

  const csrfToken = req.csrfToken();

  return res.json({ csrfToken });
};
