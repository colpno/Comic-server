import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET } from '../configs/common.conf';
import { JWTPayload } from '../types/common.type';
import { Error400, Error401, Error403 } from '../utils/error.utils';

const isAuthenticated: RequestHandler = (req, _, next) => {
  const authorization = req.header('Authorization')?.split(' ');
  const [authorizationType, accessToken] = authorization || [];

  if (authorizationType !== 'Bearer') {
    throw new Error400('Invalid Authorization Type');
  }

  if (!accessToken) {
    throw new Error401('Login is required');
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err: unknown, decoded: unknown) => {
    if (err) {
      throw new Error403('Invalid Access Token');
    }

    req.user = decoded as JWTPayload;

    next();
  });
};

export default isAuthenticated;
