import { config } from 'dotenv';

import { Error500 } from '../utils/error.utils';

config();

export const APP_ENVIRONMENT = process.env.NODE_ENV || 'production';

/** Separate multiple origins with a space. */
export const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173';

if (!process.env.CSRF_SECRET) {
  throw new Error500('CSRF_SECRET is not provided');
}
if (!process.env.COOKIE_SECRET) {
  throw new Error500('COOKIE_SECRET is not provided');
}
if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error500('ACCESS_TOKEN_SECRET is not provided');
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error500('REFRESH_TOKEN_SECRET is not provided');
}

export const CSRF_SECRET = process.env.CSRF_SECRET;
export const COOKIE_SECRET = process.env.COOKIE_SECRET;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (APP_ENVIRONMENT === 'production') {
  if (!process.env.COOKIE_DOMAIN) {
    throw new Error500('COOKIE_DOMAIN is not provided');
  }
}
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
export const COOKIE_NAME_CSRF_TOKEN =
  APP_ENVIRONMENT === 'production' ? '__Secure-psifi.csrf-token' : 'csrf-token';
export const COOKIE_NAME_ACCESS_TOKEN =
  APP_ENVIRONMENT === 'production' ? '__Secure-access-token' : 'access-token';
export const COOKIE_NAME_REFRESH_TOKEN =
  APP_ENVIRONMENT === 'production' ? '__Secure-refresh-token' : 'refresh-token';
