import { config } from 'dotenv';

config();

/** Separate multiple origins with a space. */
export const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173';
