import qs from 'qs';
import request from 'supertest';

import app from '../../app';
import { COOKIE_NAME_REFRESH_TOKEN } from '../configs/common.conf';
import { BASE_ENDPOINT } from '../constants/common.constant';
import { SuccessfulResponse } from '../types/api.type';
import { serializeObject } from '../utils/console.util';
import { Error500 } from '../utils/error.utils';

export const stringifyQuery = (obj: Record<string, unknown>) => qs.stringify(obj);

export const login = async () => {
  try {
    //  Retrieve CSRF token
    const getCsrfRoute = `${BASE_ENDPOINT}/auth/csrf-token`;

    const getCsrfResponse = await request(app).get(getCsrfRoute);

    const { data: csrfToken } = getCsrfResponse.body as SuccessfulResponse<string | undefined>;
    const csrfTokenCookie = getCsrfResponse.headers['set-cookie'] as unknown as
      | string[]
      | undefined;

    if (!csrfToken) {
      throw new Error500('No CSRF token is returned in body');
    }
    if (!csrfTokenCookie) {
      throw new Error500('No CSRF token is set in cookie');
    }

    // Login
    const loginRoute = `${BASE_ENDPOINT}/auth/login`;

    const loginResponse = await request(app)
      .post(loginRoute)
      .set('Cookie', csrfTokenCookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ username: 'admin', password: 'admin' });

    const { data: accessToken } = loginResponse.body as SuccessfulResponse<string | undefined>;
    const cookies = loginResponse.headers['set-cookie'] as unknown as string[] | undefined;
    const refreshToken = cookies?.find((cookie) => cookie.includes(COOKIE_NAME_REFRESH_TOKEN));

    if (!accessToken) {
      throw new Error500('No access token is returned in body');
    }
    if (!refreshToken) {
      throw new Error500('No refresh token is set in cookie');
    }

    return { csrfToken, accessToken, refreshToken };
  } catch (error) {
    console.error(serializeObject(error));
    throw error;
  }
};
