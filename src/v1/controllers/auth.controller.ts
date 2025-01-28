import { RequestHandler } from 'express';
import { errors } from 'jose';

import { HTTP_204_NO_CONTENT } from '../../constants/httpCode.constant';
import {
  ACCESS_TOKEN_ENCRYPT_SECRET,
  ACCESS_TOKEN_SECRET,
  COOKIE_NAME_REFRESH_TOKEN,
  REFRESH_TOKEN_ENCRYPT_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../configs/common.conf';
import { clearCookieConfig, cookieConfig } from '../configs/cookie.conf';
import { createUser, getUser, updateUser } from '../services/user.service';
import { SuccessfulResponse } from '../types/api.type';
import { JWTPayload } from '../types/common.type';
import { User } from '../types/user.type';
import { toObjectId } from '../utils/converter.util';
import { generateSalt, hashString } from '../utils/crypto.util';
import { Error400, Error401, Error403 } from '../utils/error.utils';
import { decryptAndVerifyJWT, signAndEncryptJWT } from '../utils/jwt.util';

const _15MINS = '15m';
const _1DAY = '1d';

const createAccessToken = (payload: Record<string, unknown>) => {
  return signAndEncryptJWT(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_ENCRYPT_SECRET, {
    expiresIn: _15MINS,
  });
};

const createRefreshToken = (payload: Record<string, unknown>, rememberMe?: boolean) => {
  return signAndEncryptJWT(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_ENCRYPT_SECRET, {
    expiresIn: rememberMe ? _1DAY : '50y',
  });
};

export type GenerateCSRFToken = RequestHandler<{}, Pick<SuccessfulResponse<string>, 'data'>>;

export const generateCSRFToken: GenerateCSRFToken = (req, res, next) => {
  try {
    return res.json({ data: req.csrfToken() });
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username: string;
  password: string;
  rememberMe?: boolean;
}
type LoginReturnType = SuccessfulResponse<{
  accessToken: string;
}>;
export type Login = RequestHandler<{}, LoginReturnType, LoginBody>;

export const login: Login = async (req, res, next) => {
  try {
    const { username, password, rememberMe } = req.body;

    // Check if the user is already registered
    const user = await getUser({ username });
    if (!user) {
      throw new Error400(`${username} is not registered`);
    }

    // Compare passwords
    const hashedPassword = hashString(password, user.password.salt).hashedValue;
    if (user.password.hashed !== hashedPassword) {
      throw new Error400('Password is incorrect');
    }

    // Create tokens
    const jwtPayload: JWTPayload = {
      userId: user.id,
    };

    const accessToken = await createAccessToken(jwtPayload);

    let refreshToken = user.refreshToken;

    // Create a new refresh token if there is no refresh token
    if (!refreshToken) {
      refreshToken = await createRefreshToken(jwtPayload, rememberMe);
    } else {
      // User has a refresh token
      try {
        // Try to verify the refresh token
        await decryptAndVerifyJWT<JWTPayload>(
          refreshToken,
          REFRESH_TOKEN_ENCRYPT_SECRET,
          REFRESH_TOKEN_SECRET
        );
      } catch (error) {
        // Refresh token is expired, create a new one
        if (error instanceof errors.JWTExpired) {
          refreshToken = await createRefreshToken(jwtPayload, rememberMe);
        } else {
          // Other token errors
          next(error);
        }
      }
    }

    // Update the refresh token
    if (refreshToken !== user.refreshToken) {
      await updateUser({ _id: user.id }, { refreshToken });
    }
    res.cookie(COOKIE_NAME_REFRESH_TOKEN, refreshToken, cookieConfig);

    return res.json({
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  const refreshToken = req.cookies?.[COOKIE_NAME_REFRESH_TOKEN];

  const clearCookies = () => {
    res.clearCookie(COOKIE_NAME_REFRESH_TOKEN, clearCookieConfig);
  };

  try {
    // Check the existence of the refresh token
    if (!refreshToken) {
      return res.sendStatus(HTTP_204_NO_CONTENT);
    }

    clearCookies();

    return res.sendStatus(HTTP_204_NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  passwordVerification: string;
}
export type Register = RequestHandler<{}, unknown, RegisterBody>;

export const register: Register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await getUser({ username });
    if (existingUser) {
      throw new Error400('Email already exists');
    }

    // Hash the password
    const salt = generateSalt();
    const hashedPassword = hashString(password, salt).hashedValue;

    // Create the new user
    const newUser: Parameters<typeof createUser>[0] = {
      username,
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
  password: string;
  passwordVerification: string;
  email?: string;
}
export type ResetPassword = RequestHandler<{}, unknown, ResetPasswordBody>;

export const resetPassword: ResetPassword = async (req, res, next) => {
  try {
    const { email, password, passwordVerification } = req.body;
    const { userId } = req.user;

    // Check the existence of the user
    const existingUser = await getUser(email ? { email } : { _id: toObjectId(userId) });
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
    const result = await updateUser({ _id: toObjectId(userId) }, neededUpdate);

    // No user is updated
    if (!result) {
      throw new Error400('Failed to update the password');
    }

    return res.sendStatus(HTTP_204_NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

type RefreshAccessToken = RequestHandler<{}, SuccessfulResponse<{ accessToken: string }>>;

export const refreshAccessToken: RefreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[COOKIE_NAME_REFRESH_TOKEN];

    // No refresh token in the cookie
    if (!refreshToken) {
      throw new Error403();
    }

    let payload: JWTPayload;
    try {
      // Verify the refresh token
      payload = await decryptAndVerifyJWT<JWTPayload>(
        refreshToken,
        REFRESH_TOKEN_ENCRYPT_SECRET,
        REFRESH_TOKEN_SECRET
      );
    } catch (error) {
      // Refresh token is expired
      if (error instanceof errors.JWTExpired) {
        throw new Error401('Login is required');
      } else {
        next(error);
      }
    }

    // Create a new access token
    const newPayload: JWTPayload = {
      userId: payload!.userId,
    };
    const accessToken = await createAccessToken(newPayload);

    return res.json({
      data: {
        accessToken: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
