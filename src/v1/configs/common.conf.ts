import { config } from 'dotenv';

config();

export const API_VERSION = 'v1';
export const BASE_ENDPOINT = process.env.BASE_ENDPOINT
  ? `${process.env.BASE_ENDPOINT}/${API_VERSION}`
  : `/api/${API_VERSION}`;

/** Separate multiple origins with a space. */
export const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173';
