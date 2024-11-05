import { config } from 'dotenv';

config();

export const APP_ENVIRONMENT = process.env.NODE_ENV || 'production';

/** Separate multiple origins with a space. */
export const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173';
