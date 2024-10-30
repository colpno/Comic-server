import { config } from 'dotenv';

config();

export const API_VERSION = 'v1' as const;
export const BASE_ENDPOINT = `/api/${API_VERSION}` as const;

/** Separate multiple origins with a space. */
export const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173';
