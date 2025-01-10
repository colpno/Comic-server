import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET } from '../configs/common.conf';
import { JWTPayload } from '../types/common.type';
import { Error401, Error403 } from '../utils/error.utils';

const isAuthenticated: RequestHandler = (req, _, next) => {
  const authHeader = req.headers['authorization'] as string | undefined;

  if (!authHeader) {
    throw new Error401('Authorization header is missing');
  }

  const accessToken = authHeader.split(' ')[1];

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
