import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import { HTTP_204_NO_CONTENT } from '../../constants/httpCode.constant';
import {
  ACCESS_TOKEN_SECRET,
  COOKIE_NAME_REFRESH_TOKEN,
  REFRESH_TOKEN_SECRET,
} from '../configs/common.conf';
import cookieConfig from '../configs/cookie.conf';
import { generateToken } from '../middlewares/csrf.middleware';
import { getUser } from '../services/user.service';
import { SuccessfulResponse } from '../types/api.type';
import { JWTPayload } from '../types/common.type';
import { hashString } from '../utils/crypto';
import { Error400, Error404 } from '../utils/error.utils';

const MS_15MINS = moment.duration(15, 'minutes').asMilliseconds();
const MS_1DAY = moment.duration(1, 'day').asMilliseconds();
const MS_1MONTH = moment.duration(1, 'month').asMilliseconds();

export type GenerateCSRFToken = RequestHandler<{}, SuccessfulResponse<string>>;

export const generateCSRFToken: GenerateCSRFToken = (req, res, next) => {
  try {
    const csrfToken = generateToken(req, res);

    return res.json({ data: csrfToken });
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  email: string;
  password: string;
  forgetMe: boolean;
}
export type Login = RequestHandler<{}, SuccessfulResponse, LoginBody>;

export const login: Login = async (req, res, next) => {
  try {
    const { email, password, forgetMe } = req.body;
    const hashedPassword = hashString(password, 'salt').hashedValue;

    const user = await getUser({ email });

    if (!user) {
      throw new Error404(`${email} is not registered`);
    }
    if (user.password.hashed !== hashedPassword) {
      throw new Error400('Password is incorrect');
    }

    // Create tokens
    const jwtPayload: JWTPayload = {
      userId: user._id.toString(),
    };
    const accessToken = jwt.sign(jwtPayload, ACCESS_TOKEN_SECRET, { expiresIn: MS_15MINS });
    const refreshToken = jwt.sign(jwtPayload, REFRESH_TOKEN_SECRET, {
      expiresIn: forgetMe ? MS_1DAY : MS_1MONTH,
    });

    res.cookie(COOKIE_NAME_REFRESH_TOKEN, refreshToken, cookieConfig);
    return res.json({ data: accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAME_REFRESH_TOKEN];

    // No refresh token in the cookie
    if (!refreshToken) {
      return res.sendStatus(HTTP_204_NO_CONTENT);
    }

    const userWithRefreshToken = await getUser({ refreshToken });

    // User without the refresh token
    if (!userWithRefreshToken) {
      res.clearCookie(COOKIE_NAME_REFRESH_TOKEN);
      return res.sendStatus(HTTP_204_NO_CONTENT);
    }

    // User with the refresh token: clear the refresh token
    // await updateUser({ _id: userWithRefreshToken._id }, { refreshToken: '' });
    res.clearCookie(COOKIE_NAME_REFRESH_TOKEN);

    return res.sendStatus(HTTP_204_NO_CONTENT);
  } catch (error) {
    next(error);
  }
};
