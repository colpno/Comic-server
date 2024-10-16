import { config } from 'dotenv';

config();

export const BASE_ENDPOINT = process.env.BASE_ENDPOINT || '/api';

/** Separate multiple origins with a space. */
export const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173';
