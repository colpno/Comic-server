import qs from 'qs';
import request from 'supertest';

import app from '../../app';
import { COOKIE_NAME_ACCESS_TOKEN, COOKIE_NAME_REFRESH_TOKEN } from '../configs/common.conf';
import { BASE_ENDPOINT } from '../constants/common.constant';
import { SuccessfulResponse } from '../types/api.type';
import { serializeObject } from '../utils/console.util';
import { Error500 } from '../utils/error.utils';

export const stringifyQuery = (obj: Record<string, unknown>) => qs.stringify(obj);

export type CreateEndpointArgs = {
  /**
   * A string to append to the URL.
   */
  extends?: string;
  /**
   * An object of query parameters.
   */
  query?: Record<string, unknown>;
  baseEndpoint: string;
};

export const createEndpoint = (args?: CreateEndpointArgs) => {
  const queryStr = args?.query ? `?${stringifyQuery(args.query)}` : '';
  const extension = args?.extends || '';
  const baseEndpoint = args?.baseEndpoint || '';
  return `${BASE_ENDPOINT}/${baseEndpoint}${extension}${queryStr}`;
};

interface Credentials {
  email: string;
  password: string;
}

const defaultCredentials: Credentials = {
  email: 'john@gmail.com',
  password: '12345678901234567',
};

export const login = async (credentials: Credentials = defaultCredentials) => {
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
      .send(credentials);

    const cookies = loginResponse.headers['set-cookie'] as unknown as string[] | undefined;
    const accessTokenCookie = cookies?.find((cookie) => cookie.includes(COOKIE_NAME_ACCESS_TOKEN));
    const refreshTokenCookie = cookies?.find((cookie) =>
      cookie.includes(COOKIE_NAME_REFRESH_TOKEN)
    );

    if (!accessTokenCookie) {
      throw new Error500('No access token is set in cookie');
    }
    if (!refreshTokenCookie) {
      throw new Error500('No refresh token is set in cookie');
    }

    return {
      csrfToken,
      csrfTokenCookie,
      accessTokenCookie,
      refreshTokenCookie,
      /** Contains access token and refresh token. */
      authCookies: [accessTokenCookie, refreshTokenCookie],
    };
  } catch (error) {
    console.error(serializeObject(error));
    throw error;
  }
};
