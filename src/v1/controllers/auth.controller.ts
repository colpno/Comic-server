import { RequestHandler } from 'express';

import { generateToken } from '../middlewares/csrf.middleware';
import { SuccessfulResponse } from '../types/api.type';

export type GenerateCSRFToken = RequestHandler<{}, SuccessfulResponse<string>>;

export const generateCSRFToken: GenerateCSRFToken = (req, res, next) => {
  try {
    const csrfToken = generateToken(req, res);

    return res.json({ data: csrfToken });
  } catch (error) {
    next(error);
  }
};
