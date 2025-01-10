import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET, COOKIE_NAME_ACCESS_TOKEN } from '../configs/common.conf';
import { JWTPayload } from '../types/common.type';
import { Error401, Error403 } from '../utils/error.utils';

const isAuthenticated: RequestHandler = (req, _, next) => {
  const accessToken = req.cookies?.[COOKIE_NAME_ACCESS_TOKEN];

  if (!accessToken) {
    throw new Error401('Login is required');
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err: unknown, decoded: unknown) => {
    if (err) {
      throw new Error403('Invalid Access Token');
    }

    const payload = decoded as JWTPayload | undefined;
    req.user = payload;

    next();
  });
};

export default isAuthenticated;
