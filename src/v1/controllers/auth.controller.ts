import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { HTTP_204_NO_CONTENT } from '../../constants/httpCode.constant';
import {
  ACCESS_TOKEN_SECRET,
  COOKIE_NAME_ACCESS_TOKEN,
  COOKIE_NAME_REFRESH_TOKEN,
  REFRESH_TOKEN_SECRET,
} from '../configs/common.conf';
import { clearCookieConfig, cookieConfig } from '../configs/cookie.conf';
import { createUser, getUser, updateUser } from '../services/user.service';
import { SuccessfulResponse } from '../types/api.type';
import { JWTPayload } from '../types/common.type';
import { User } from '../types/user.type';
import { toMS } from '../utils/converter.util';
import { generateSalt, hashString } from '../utils/crypto';
import { Error400, Error403, Error404 } from '../utils/error.utils';

const MS_15MINS = toMS(15, 'minutes');
const MS_1DAY = toMS(1, 'day');
const MS_1MONTH = toMS(1, 'month');

export type GenerateCSRFToken = RequestHandler<{}, Pick<SuccessfulResponse<string>, 'data'>>;

export const generateCSRFToken: GenerateCSRFToken = (req, res, next) => {
  try {
    return res.json({ data: req.csrfToken() });
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  email: string;
  password: string;
  rememberMe?: boolean;
}
export type Login = RequestHandler<{}, unknown, LoginBody>;

export const login: Login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Check if the user is already registered
    const user = await getUser({ email });
    if (!user) {
      throw new Error400(`${email} is not registered`);
    }

    // Compare passwords
    const hashedPassword = hashString(password, user.password.salt).hashedValue;
    if (user.password.hashed !== hashedPassword) {
      throw new Error400('Password is incorrect');
    }

    // Create tokens
    const jwtPayload: JWTPayload = {
      userId: user._id.toString(),
    };
    const accessToken = jwt.sign(jwtPayload, ACCESS_TOKEN_SECRET, { expiresIn: MS_15MINS });
    const refreshToken = jwt.sign(jwtPayload, REFRESH_TOKEN_SECRET, {
      expiresIn: rememberMe ? MS_1DAY : MS_1MONTH,
    });

    res.cookie(COOKIE_NAME_REFRESH_TOKEN, refreshToken, cookieConfig);
    res.cookie(COOKIE_NAME_ACCESS_TOKEN, accessToken, cookieConfig);
    return res.sendStatus(HTTP_204_NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  const clearCookies = () => {
    res.clearCookie(COOKIE_NAME_REFRESH_TOKEN, clearCookieConfig);
    res.clearCookie(COOKIE_NAME_ACCESS_TOKEN, clearCookieConfig);
  };

  try {
    // Check the existence of the refresh token
    const refreshToken = req.cookies?.[COOKIE_NAME_REFRESH_TOKEN];
    if (!refreshToken) {
      return res.sendStatus(HTTP_204_NO_CONTENT);
    }

    // Get user
    const userWithRefreshToken = await getUser({ refreshToken });

    // No user with the refresh token
    if (!userWithRefreshToken) {
      clearCookies();
      return res.sendStatus(HTTP_204_NO_CONTENT);
    }

    // Remove refresh token
    await updateUser({ _id: userWithRefreshToken._id }, { refreshToken: '' });
    clearCookies();

    return res.sendStatus(HTTP_204_NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

interface RegisterBody {
  email: string;
  password: string;
  passwordVerification: string;
}
export type Register = RequestHandler<{}, unknown, RegisterBody>;

export const register: Register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await getUser({ email });
    if (existingUser) {
      throw new Error400('Email already exists');
    }

    // Hash the password
    const salt = generateSalt();
    const hashedPassword = hashString(password, salt).hashedValue;

    // Create the new user
    const newUser: Parameters<typeof createUser>[0] = {
      email,
      password: {
        hashed: hashedPassword,
        salt,
      },
    };
    await createUser(newUser);

    return res.sendStatus(HTTP_204_NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

interface ResetPasswordBody {
  email: string;
  password: string;
  passwordVerification: string;
}
export type ResetPassword = RequestHandler<{}, unknown, ResetPasswordBody>;

export const resetPassword: ResetPassword = async (req, res, next) => {
  try {
    const { email, password, passwordVerification } = req.body;

    // Check the existence of the user
    const existingUser = await getUser({ email });
    if (!existingUser) {
      throw new Error400('No user that has the email');
    }

    // Compare passwords
    if (password !== passwordVerification) {
      throw new Error400('Password and password verification do not match');
    }

    // Hash the password
    const salt = generateSalt();
    const hashedPassword = hashString(password, salt).hashedValue;

    // Update the user
    const neededUpdate: Partial<User> = {
      password: {
        hashed: hashedPassword,
        salt,
      },
    };
    const result = await updateUser({ email }, neededUpdate);

    // No user is updated
    if (!result) {
      throw new Error400('Failed to update the password');
    }

    return res.sendStatus(HTTP_204_NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAME_REFRESH_TOKEN];

    // No refresh token in the cookie
    if (!refreshToken) {
      throw new Error403();
    }

    // Check the existence of the user
    const user = await getUser({ refreshToken });
    if (!user) {
      throw new Error404('User not found');
    }

    // Verify the refresh token
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: unknown, decoded: unknown) => {
      if (err) {
        throw new Error403('Invalid refresh token');
      }

      // Create a new access token
      const decodedPayload = decoded as JWTPayload;
      const payload = {
        userId: decodedPayload.userId,
      };
      const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: MS_15MINS });

      return res.json({ data: accessToken });
    });
  } catch (error) {
    next(error);
  }
};
