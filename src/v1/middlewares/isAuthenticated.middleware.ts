import { RequestHandler } from 'express';
import { errors } from 'jose';

import { ACCESS_TOKEN_ENCRYPT_SECRET, ACCESS_TOKEN_SECRET } from '../configs/common.conf';
import { refreshAccessToken } from '../controllers/auth.controller';
import { JWTPayload } from '../types/common.type';
import { Error400, Error401 } from '../utils/error.utils';
import { decryptAndVerifyJWT } from '../utils/jwt.util';

const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const authorization = req.header('Authorization')?.split(' ');

    if (!authorization) {
      throw new Error401('Login is required');
    }

    const [authorizationType, accessToken] = authorization;

    if (authorizationType !== 'Bearer') {
      throw new Error400('Invalid Authorization Type');
    }
    if (!accessToken) {
      throw new Error401('Login is required');
    }

    const payload = await decryptAndVerifyJWT<JWTPayload>(
      accessToken,
      ACCESS_TOKEN_ENCRYPT_SECRET,
      ACCESS_TOKEN_SECRET
    );

    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      refreshAccessToken(req, res, next);
    } else {
      next(error);
    }
  }
};

export default isAuthenticated;
