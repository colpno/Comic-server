import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../app';
import { COOKIE_NAME_CSRF_TOKEN, COOKIE_NAME_REFRESH_TOKEN } from '../configs/common.conf';
import { BASE_ENDPOINT } from '../constants/common.constant';
import { SuccessfulResponse } from '../types/api.type';
import { stringifyQuery } from './';

type GetEndpointArgs = {
  /**
   * A string to append to the URL.
   */
  extends?: string;
  /**
   * An object of query parameters.
   */
  query?: Record<string, unknown>;
};

/**
 * Retrieve auth endpoint.
 */
const getEndpoint = (args?: GetEndpointArgs) => {
  const queryStr = args?.query ? `?${stringifyQuery(args.query)}` : '';
  const extension = args?.extends || '';
  return `${BASE_ENDPOINT}/auth${extension}${queryStr}`;
};

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('Auth', () => {
  let csrfToken: string | undefined = undefined;
  let csrfTokenCookie: string[] | undefined = undefined;
  let accessToken: string | undefined = undefined;
  let refreshToken: string | undefined = undefined;

  it('should return a csrf token in both cookie and body', async () => {
    const endpoint = getEndpoint({ extends: '/csrf-token' });

    const response = await request(app).get(endpoint);

    const { data: responseCsrfToken } = response.body as SuccessfulResponse<string>;
    const cookies = response.headers['set-cookie'] as unknown as string[] | undefined;
    const csrfCookie = cookies?.find((cookie) => cookie.includes(COOKIE_NAME_CSRF_TOKEN));
    const isProperlySetCsrfCookie =
      csrfCookie && csrfCookie.includes('HttpOnly') && csrfCookie.includes('Max-Age');

    expect(response.status).toBe(200);
    expect(responseCsrfToken).toBeDefined();
    expect(csrfCookie).toBeDefined();
    expect(isProperlySetCsrfCookie).toBe(true);

    csrfToken = responseCsrfToken;
    csrfTokenCookie = cookies;
  });

  describe('Login', () => {
    it('should return 403 when accessing /login without a csrf token', async () => {
      const endpoint = getEndpoint({ extends: '/login' });

      const response = await request(app).post(endpoint);

      expect(response.status).toBe(403);
    });

    it('Should return 400 when accessing /login with invalid input', async () => {
      if (!(csrfToken && csrfTokenCookie)) {
        throw new Error('csrfToken and cookie are not set');
      }

      const endpoint = getEndpoint({ extends: '/login' });
      const credential = {
        email: 'john@gmail.com',
        password: 'johnajsodiasjdaisodjas',
        rememberMe: false,
      };

      const response = await request(app)
        .post(endpoint)
        .set('Cookie', csrfTokenCookie)
        .set('X-CSRF-Token', csrfToken)
        .send(credential);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('reason');
      expect(/password/i.test(response.body.reason)).toBe(true);
    });

    it('should return access token and refresh token after logging in', async () => {
      if (!(csrfToken && csrfTokenCookie)) {
        throw new Error('csrfToken and cookie are not set');
      }

      const endpoint = getEndpoint({ extends: '/login' });
      const credential = {
        email: 'john@gmail.com',
        password: 'johnjohnjohnjohnjohn',
        rememberMe: false,
      };

      const response = await request(app)
        .post(endpoint)
        .set('Cookie', csrfTokenCookie)
        .set('X-CSRF-Token', csrfToken)
        .send(credential);

      const { data: responseAccessToken } = response.body as SuccessfulResponse<string>;
      const cookies = response.headers['set-cookie'] as unknown as string[] | undefined;
      const refreshTokenCookie = cookies?.find((cookie) =>
        cookie.includes(COOKIE_NAME_REFRESH_TOKEN)
      );
      const isProperlySetRefreshTokenCookie =
        refreshTokenCookie &&
        refreshTokenCookie.includes('HttpOnly') &&
        refreshTokenCookie.includes('Max-Age');

      expect(response.status).toBe(200);
      expect(responseAccessToken).toBeDefined();
      expect(refreshTokenCookie).toBeDefined();
      expect(isProperlySetRefreshTokenCookie).toBe(true);

      accessToken = responseAccessToken;
      refreshToken = refreshTokenCookie;
    });
  });

  describe('Register', () => {
    it('should return 403 when accessing /register without a csrf token', async () => {
      const endpoint = getEndpoint({ extends: '/register' });

      const response = await request(app).post(endpoint);

      expect(response.status).toBe(403);
    });

    it('Should return 400 when accessing /register with invalid input', async () => {
      if (!(csrfToken && csrfTokenCookie)) {
        throw new Error('csrfToken and cookie are not set');
      }

      const endpoint = getEndpoint({ extends: '/register' });
      const credential = {
        email: 'john@gmail.com',
        password: 'johnajsodiasjdaisodjas',
      };

      const response = await request(app)
        .post(endpoint)
        .set('Cookie', csrfTokenCookie)
        .set('X-CSRF-Token', csrfToken)
        .send(credential);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('reason');
      expect(/password/i.test(response.body.reason)).toBe(true);
    });
  });

  describe('Refresh Token', () => {
    it('should return 403 when refreshing access token without refresh token', async () => {
      const endpoint = getEndpoint({ extends: '/refresh-token' });

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(403);
    });

    it('should return 403 when refreshing access token with invalid refresh token', async () => {
      const endpoint = getEndpoint({ extends: '/refresh-token' });

      const response = await request(app)
        .get(endpoint)
        .set('Cookie', `${COOKIE_NAME_REFRESH_TOKEN}=invalid_refresh_token`);

      expect(response.status).toBe(403);
    });

    it('should return new access token with a valid refresh token', async () => {
      if (!refreshToken) {
        throw new Error('refreshToken is not set');
      }

      const endpoint = getEndpoint({ extends: '/refresh-token' });

      const response = await request(app).get(endpoint).set('Cookie', refreshToken);

      const { data: newAccessToken } = response.body as SuccessfulResponse<string>;

      expect(response.status).toBe(200);
      expect(newAccessToken).toBeDefined();
    });
  });

  describe('Logout', () => {
    it('should return 401 when accessing /logout without authorization', async () => {
      const endpoint = getEndpoint({ extends: '/logout' });

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(401);
    });

    it('should logout successfully when already authorizing', async () => {
      if (!(accessToken && refreshToken)) {
        throw new Error('accessToken and refreshToken are not set');
      }

      const endpoint = getEndpoint({ extends: '/logout' });

      const response = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', refreshToken);

      expect(response.status).toBe(204);
    });
  });
});
